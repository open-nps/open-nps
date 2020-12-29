import React from 'react';
import Typography from '@material-ui/core/Typography';

import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { ThemeOptions } from '@material-ui/core/styles';
import { withStyles, WithStyles, createStyles } from '@material-ui/styles';

import Research from '~/model/Research';
import Target, { ITarget } from '~/model/Target';

import { AddThemeOptsDefaults } from '~/util/themeOpts';
import { template } from '~/util/template';
import { IReviewer } from '~/model/Reviewer';

const styles = () =>
  createStyles({
    root: {
      maxWidth: '800px',
      margin: '0 auto',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

interface Props extends WithStyles<typeof styles> {
  mui: ThemeOptions;
  themeOpts: ThemeOptionsConfigValues;
  templates: TemplatesConfigValues;
  researchId: string;
  data: {
    reviewer: IReviewer;
    target: ITarget;
  };
}

export const getServerSideProps = async (
  ctx: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<Props>> => {
  const { connectMongo } = await import('../../util/mongo');
  const { researchId } = ctx.query;

  await connectMongo();

  const research = await Research.findOne({ _id: researchId })
    .populate('reviewer', { _id: 0 })
    .lean();

  const target = await Target.findOne({ _id: research.target })
    .populate('configs', { _id: 0 })
    .lean();

  const { themeOpts, ...configs } = target.configs.reduce(
    (a, c) => ({ ...a, [c.key]: c.values }),
    {}
  );
  return {
    props: {
      ...configs,
      themeOpts: AddThemeOptsDefaults(themeOpts),
      researchId,
      data: {
        reviewer: (research.reviewer as IReviewer).meta || {},
        target: target.meta,
      },
    },
  };
};

export const ThanksPage: React.FC<Props> = ({ classes, templates, data }) => (
  <div className={classes.root}>
    <Typography variant="h2" component="h2">
      {template(templates.ThanksPhrase, data)}
    </Typography>
  </div>
);

export default withStyles(styles)(ThanksPage);
