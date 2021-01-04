import React, { useState } from 'react';
import Typography from '@material-ui/core/Typography';

import { useRouter, NextRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next';

import ResearchNotes from '~/components/ResearchNotes';
import ResearchComment from '~/components/ResearchComment';
import ResearchSubmit from '~/components/ResearchSubmit';

import { template } from '~/util/template';
import {
  withLayout,
  LayoutProps,
  getServerSidePropsFn,
} from '~/layouts/NPSResearchLayout';

export const ctxResearchIdGetter = (ctx: GetServerSidePropsContext): string =>
  ctx.params.id as string;

export const getServerSideProps = getServerSidePropsFn({
  ctxResearchIdGetter,
  researchExtraData: { concluded: false },
});

interface SubmitData {
  researchId: string;
  note: string;
  comment: string;
}

export const createSubmit = (data: SubmitData, router: NextRouter) => async (
  e: React.FormEvent<HTMLFormElement>
): Promise<void> => {
  e.preventDefault();
  const response = await fetch(
    `${window.location.origin}/api/research/conclude`,
    {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }
  );

  const { ok } = await response.json();

  if (ok) {
    router.push(`/research/thanks?researchId=${data.researchId}`);
  }
};

export const setValueForFieldInState = (
  state: AnyObject,
  setState: SimpleFn<AnyObject, void>
) => (field: string) => (value: string): void =>
  setState({ ...state, [field]: value });

export const ResearchPage: React.FC<LayoutProps> = ({
  themeOpts,
  templates,
  data,
  researchId,
  layoutClasses,
}): React.ReactElement => {
  const [state, setState] = useState({ note: null, comment: '' });
  const router = useRouter();
  const onSubmit = createSubmit({ researchId, ...state }, router);
  const setValueForField = setValueForFieldInState(state, setState);

  return (
    <form className={layoutClasses.root} onSubmit={onSubmit}>
      <Typography variant="h2" component="h2">
        {template(templates.CoreQuestionPhrase, data)}
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
  );
};

export default withLayout(ResearchPage);
