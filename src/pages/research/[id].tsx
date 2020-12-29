import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import {
  ThemeProvider,
  createMuiTheme,
  ThemeOptions,
  makeStyles,
} from '@material-ui/core/styles';

import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';

import ResearchNotes from '~/components/ResearchNotes';
import ResearchComment from '~/components/ResearchComment';
import ResearchSubmit from '~/components/ResearchSubmit';

import { Target, Research } from '~/model';
import { AddThemeOptsDefaults } from '~/util/themeOpts';

const useStyles = makeStyles(() => ({
  root: {
    maxWidth: '800px',
    margin: '0 auto',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

interface Props {
  mui: ThemeOptions;
  themeOpts: ThemeOptionsConfigValues;
  templates: TemplatesConfigValues;
  researchId: string;
}

export const getServerSideProps = async (
  ctx: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<Props>> => {
  const { connectMongo } = await import('../../util/mongo');
  const researchId = ctx.params.id;

  await connectMongo();

  const research = await Research.findOne({
    _id: researchId,
    concluded: false,
  });
  const target = await Target.findById(research.target)
    .populate('configs', { _id: 0 })
    .lean();

  if (!target || !research) {
    return { notFound: true };
  }

  const { themeOpts, ...configs } = target.configs.reduce(
    (a, c) => ({ ...a, [c.key]: c.values }),
    {}
  );
  return {
    props: {
      ...configs,
      themeOpts: AddThemeOptsDefaults(themeOpts),
      researchId,
    },
  };
};

export const ResearchPage: React.FC<Props> = ({
  mui,
  themeOpts,
  templates,
  researchId,
}) => {
  const [state, setState] = useState({ note: null, comment: '' });
  const router = useRouter();
  const classes = useStyles();
  const setValueForField = (field) => (value) =>
    setState({ ...state, [field]: value });

  const onSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(
      `${window.location.origin}/api/research/conclude`,
      {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ researchId, ...state }),
      }
    );

    const { ok } = await response.json();

    if (ok) {
      router.push(`/research/thanks?researchId=${researchId}`);
    }
  };

  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <ThemeProvider theme={createMuiTheme(mui)}>
      <CssBaseline />
      <form className={classes.root} onSubmit={onSubmit}>
        <Typography variant="h2" component="h2">
          {templates.CoreQuestionPhrase}
        </Typography>
        <ResearchNotes
          themeOpts={themeOpts}
          setValue={setValueForField('note')}
          selected={state.note}
        />
        <ResearchComment
          value={state.comment}
          setValue={setValueForField('comment')}
          label={templates.ResearchCommentLabel}
          placeholder={templates.ResearchCommentPlaceholder}
        />
        <ResearchSubmit themeOpts={themeOpts}>Enviar</ResearchSubmit>
      </form>
    </ThemeProvider>
  );
};

export default ResearchPage;
