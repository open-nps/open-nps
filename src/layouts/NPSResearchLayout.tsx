import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import get from 'lodash.get';

import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import {
  ThemeProvider,
  createMuiTheme,
  ThemeOptions,
  makeStyles,
  WithStyles,
  createStyles,
} from '@material-ui/core/styles';

import { ITarget } from '~/model/Target';
import { IResearch } from '~/model/Research';
import { IConfig } from '~/model/Config';
import { IReviewer } from '~/model/Reviewer';
import { AddThemeOptsDefaults } from '~/util/themeOpts';

const styles = (theme) =>
  createStyles({
    root: {
      height: '100vh',
      maxWidth: '750px',
      margin: '0 auto',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing(2),

      '& > h4': {
        marginBottom: theme.spacing(3),
        textAlign: 'justify',
      },
    },
  });

const useStyles = makeStyles(styles);

export interface LayoutProps extends LayoutSharedProps {
  layoutClasses: WithStyles<ReturnType<typeof styles>>['classes'];
}

interface LayoutSharedProps {
  themeOpts: ThemeOptionsConfigValues;
  templates: TemplatesConfigValues;
  researchId: string;
  data: {
    reviewer: IReviewer['meta'];
    target: IReviewer['meta'];
  };
}

interface Props extends LayoutSharedProps {
  mui: ThemeOptions;
}

interface GetServerSideProps {
  ctxResearchIdGetter(ctx: GetServerSidePropsContext): string;
  researchExtraData: { concluded: boolean };
}
export const getServerSidePropsFn = ({
  ctxResearchIdGetter,
  researchExtraData,
}: GetServerSideProps) => async (
  ctx: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<Props>> => {
  const researchId = ctxResearchIdGetter(ctx);
  const { connectMongo } = await import('../util/mongo');
  const { Target, Research } = await import('../model');

  await connectMongo();

  const research: IResearch = await Research.findOne({
    _id: researchId,
    ...researchExtraData,
  }).populate('reviewer', { _id: 0 });

  const target: ITarget = research
    ? await Target.findById(research.target).populate('configs', { _id: 0 })
    : null;

  if (!research || !target) {
    return { notFound: true };
  }

  const configs: AnyObject = (target.configs as IConfig[]).reduce(
    (a, c) => ({ ...a, [c.key]: c.values }),
    {}
  );

  return {
    props: {
      mui: configs.mui,
      templates: configs.templates,
      themeOpts: AddThemeOptsDefaults(configs.themeOpts),
      data: {
        reviewer: get(research, 'reviewer.meta', {}),
        target: get(target, 'meta', {}),
      },
      researchId,
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
  const classes: LayoutProps['layoutClasses'] = useStyles();

  React.useEffect(removeLocalJSS, []);

  return (
    <ThemeProvider theme={createMuiTheme(mui)}>
      <CssBaseline />
      <Component {...props} layoutClasses={classes} />
    </ThemeProvider>
  );
};

export default withLayout;
