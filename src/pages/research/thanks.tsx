import React from 'react';
import { withStyles, WithStyles, createStyles } from '@material-ui/styles';
import { GetServerSidePropsContext } from 'next';
import { Research, Target } from '../../model';
import { AddThemeOptsDefaults } from '../../util/themeOpts';
import { ThemeOptions } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const styles = () => createStyles({
  root: {
    maxWidth: '800px',
    margin: '0 auto',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  }
})

interface Props extends WithStyles<typeof styles> {
  mui: ThemeOptions;
  themeOpts: ThemeOptionsConfigValues;
  templates: TemplatesConfigValues;
  researchId: string;
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { connectMongo } = await import('../../util/mongo');
  const { researchId } = ctx.query;

  await connectMongo();

  const research = await Research.findOne({ _id: researchId })
    .populate('reviewer', {_id: 0})
    .lean()

  const target = await Target.findOne({ _id: research.target })
    .populate('configs', {_id: 0})
    .lean()

  const {themeOpts, ...configs} = target.configs.reduce((a, c) => ({ ...a, [c.key]: c.values }), {});
  return { props: { ...configs, themeOpts: AddThemeOptsDefaults(themeOpts), researchId } };
}

export const ThanksPage = ({ classes, templates }: Props) => (
  <div className={classes.root}>
    <Typography variant="h2" component="h2">
      { templates.ThanksPhrase }
    </Typography>
  </div>
)

export default withStyles(styles)(ThanksPage);
