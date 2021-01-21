import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import get from 'lodash.get';
import merge from 'lodash.merge';

import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
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
  surveyExtraData: { concluded: boolean };
}

const mapConfigsFromList = (configs: IConfig[]) =>
  configs.reduce((a, c) => ({ ...a, [c.key]: c.values }), {});

export const getServerSidePropsFn = ({
  ctxSurveyIdGetter,
  surveyExtraData,
}: GetServerSideProps) => async (
  ctx: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<Props>> => {
  const surveyId = ctxSurveyIdGetter(ctx);
  const { connectMongo } = await import('../util/mongo');
  const { Target, Survey } = await import('../model');

  await connectMongo();

  const survey: ISurvey = await Survey.findOne({
    _id: surveyId,
    ...surveyExtraData,
  });

  const target: ITarget = survey
    ? await Target.findById(survey.target).populate('configs', { _id: 0 })
    : null;

  if (!survey || !target) {
    return { notFound: true };
  }

  const overrideConfigsList = await survey.getOverrideConfigs();
  const overrideConfigs: AnyObject[] = overrideConfigsList.map(
    mapConfigsFromList
  );

  const configs: AnyObject = [
    mapConfigsFromList(target.configs as IConfig[]),
    ...overrideConfigs,
  ].reduce((a, b) => merge(a, b), {});

  return {
    props: {
      mui: get(configs, 'mui', {}),
      templates: AddDefaultTemplates(configs.templates),
      themeOpts: AddThemeOptsDefaults(configs.themeOpts),
      data: {
        reviewer: JSON.parse(JSON.stringify(survey.reviewer)),
        target: get(target, 'meta', {}),
      },
      surveyId,
    },
  };
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
