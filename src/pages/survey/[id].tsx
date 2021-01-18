import React, { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import get from 'lodash.get';

import { useRouter, NextRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next';

import SurveyNotes from '~/components/SurveyNotes';
import SurveyComment from '~/components/SurveyComment';
import SurveySubmit from '~/components/SurveySubmit';

import { renderTemplate } from '~/util/renderTemplate';
import {
  withLayout,
  LayoutProps,
  getServerSidePropsFn,
} from '~/layouts/NPSSurveyLayout';

export const ctxSurveyIdGetter = (ctx: GetServerSidePropsContext): string =>
  ctx.params.id as string;

export const getServerSideProps = getServerSidePropsFn({
  ctxSurveyIdGetter,
  surveyExtraData: { concluded: false },
});

interface SubmitData {
  surveyId: string;
  note: string;
  comment: string;
}

export const createSubmit = (data: SubmitData, router: NextRouter) => async (
  e: React.FormEvent<HTMLFormElement>
): Promise<void> => {
  e.preventDefault();
  const response = await fetch(
    `${window.location.origin}/api/survey/conclude`,
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
    router.push(`/survey/thanks?surveyId=${data.surveyId}`);
  }
};

export const setValueForFieldInState = (
  state: AnyObject,
  setState: SimpleFn<AnyObject, void>
) => (field: string) => (value: string): void =>
  setState({ ...state, [field]: value });

export const SurveyPage: React.FC<LayoutProps> = ({
  themeOpts,
  templates,
  data,
  surveyId,
  layoutClasses,
}): React.ReactElement => {
  const [state, setState] = useState({ note: null, comment: '' });
  const router = useRouter();
  const onSubmit = createSubmit({ surveyId, ...state }, router);
  const setValueForField = setValueForFieldInState(state, setState);

  return (
    <form className={layoutClasses.root} onSubmit={onSubmit}>
      {themeOpts.SurveyTopBrandImage && (
        <div
          style={{
            maxWidth: get(themeOpts, 'SurveyTopBrandImage.width', 'auto'),
          }}
          className={layoutClasses.brand}
        >
          <img
            alt={themeOpts.SurveyTopBrandImage.alt}
            src={themeOpts.SurveyTopBrandImage.url}
          />
        </div>
      )}
      <Typography data-cy="SurveyPageTypography" variant="h4" component="h4">
        {renderTemplate(templates.CoreQuestionPhrase, data)}
      </Typography>
      <SurveyNotes
        themeOpts={themeOpts}
        setValue={setValueForField('note')}
        selected={state.note}
      />
      <SurveyComment
        value={state.comment}
        setValue={setValueForField('comment')}
        label={templates.SurveyCommentLabel}
        placeholder={templates.SurveyCommentPlaceholder}
      />
      <SurveySubmit themeOpts={themeOpts}>
        {templates.SendButtonMessage}
      </SurveySubmit>
    </form>
  );
};

export default withLayout(SurveyPage);
