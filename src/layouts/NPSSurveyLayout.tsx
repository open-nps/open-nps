import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import get from 'lodash.get';
import merge from 'lodash.merge';

import {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  Redirect,
} from 'next';
import {
  ThemeProvider,
  createMuiTheme,
  ThemeOptions,
  makeStyles,
  WithStyles,
  createStyles,
  Theme,
} from '@material-ui/core/styles';

import { ITarget } from '~/model/Target';
import { ISurvey } from '~/model/Survey';
import { IConfig } from '~/model/Config';
import { AddThemeOptsDefaults } from '~/util/themeOpts';
import { AddDefaultTemplates } from '~/util/templates';
import { logger } from '~/util/logger';

const childrenStyles = ({
  SurveyBoxBorderSize,
  SurveyBoxBorderRadius,
}: ThemeOptionsConfigValues) => (theme: Theme) =>
  createStyles({
    root: {
      maxWidth: '750px',
      margin: '0 auto',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing(4),
      border: `${SurveyBoxBorderSize} solid ${theme.palette.primary.main}`,
      borderRadius: SurveyBoxBorderRadius,
    },
    corePhrase: {
      marginBottom: theme.spacing(3),
      textAlign: 'justify',
    },
    commentPhrase: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(1),
      textAlign: 'justify',
    },
    brand: {
      width: '100%',
      marginBottom: theme.spacing(3),

      '& > img': {
        width: '100%',
      },
    },
  });

const styles = (theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      height: '100vh',
      padding: theme.spacing(2),
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

const useStyles = makeStyles(styles);

export interface LayoutProps extends LayoutSharedProps {
  layoutClasses: WithStyles<ReturnType<typeof childrenStyles>>['classes'];
}

interface LayoutSharedProps {
  isIframe: boolean;
  themeOpts: ThemeOptionsConfigValues;
  templates: TemplatesConfigValues;
  surveyId: string;
  data: {
    reviewer: AnyObject;
    target: ITarget['meta'];
  };
}

interface Props extends LayoutSharedProps {
  mui: ThemeOptions;
}

interface GetServerSideProps {
  ctxSurveyIdGetter(ctx: GetServerSidePropsContext): string;
  handle404(survey: ISurvey, target?: ITarget): boolean;
  handleRedirect(survey: ISurvey, target?: ITarget): Redirect | null;
}

const mapConfigsFromList = (configs: IConfig[]) =>
  configs.reduce((a, c) => ({ ...a, [c.key]: c.values }), {});

export const getServerSidePropsFn = ({
  ctxSurveyIdGetter,
  handle404,
  handleRedirect,
}: GetServerSideProps) => async (
  ctx: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<Props>> => {
  logger.silly('start: NPSSurveyLayout.getServerSideProps');

  const surveyId = ctxSurveyIdGetter(ctx);
  const { connectMongo } = await import('../util/mongo');
  const { Target, Survey } = await import('../model');
  const log = `NPSSurveyLayout.getServerSideProps.SurveyId<${surveyId}>`;

  logger.silly(log);
  await connectMongo();

  const survey: ISurvey = await Survey.findOne({ _id: surveyId });
  logger.debug(log, { survey });

  const target: ITarget = survey
    ? await Target.findById(survey.target).populate('configs', { _id: 0 })
    : null;

  if (handle404(survey, target)) {
    logger.debug(log, { handle: 'NotFound' });
    return { notFound: true };
  }

  const redirect = handleRedirect(survey, target);
  if (redirect) {
    logger.debug(log, { handle: 'Redirect' });
    return { redirect };
  }

  const overrideConfigsList = await survey.getOverrideConfigs();
  const overrideConfigs: AnyObject[] = overrideConfigsList.map(
    mapConfigsFromList
  );

  const configs: AnyObject = [
    mapConfigsFromList(target.configs as IConfig[]),
    ...overrideConfigs,
  ].reduce((a, b) => merge(a, b), {});

  const props = {
    isIframe: ctx.query.hasOwnProperty('iframe'), // eslint-disable-line
    mui: get(configs, 'mui', {}),
    templates: AddDefaultTemplates(configs.templates),
    themeOpts: AddThemeOptsDefaults(configs.themeOpts),
    data: {
      reviewer: JSON.parse(JSON.stringify(survey.reviewer)),
      target: get(target, 'meta', {}),
    },
    surveyId,
  };

  logger.debug(log, { props });
  return { props };
};

/* istanbul ignore next */
export const removeLocalJSS = (): void => {
  const jssStyles = document.querySelector('#jss-server-side');
  if (jssStyles) {
    jssStyles.parentElement.removeChild(jssStyles);
  }
};

export const withLayout = (
  Component: React.FC<LayoutProps>
): React.FC<Props> => ({ mui, ...props }): React.ReactElement => {
  const layoutClasses: LayoutProps['layoutClasses'] = makeStyles(
    childrenStyles(props.themeOpts)
  )();
  const classes = useStyles();

  React.useEffect(removeLocalJSS, []);

  return (
    <ThemeProvider theme={createMuiTheme(mui)}>
      <CssBaseline />
      <div className={classes.root}>
        <Component {...props} layoutClasses={layoutClasses} />
      </div>
    </ThemeProvider>
  );
};

export default withLayout;
