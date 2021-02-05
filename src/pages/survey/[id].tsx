import React, { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import get from 'lodash.get';

import { useRouter, NextRouter } from 'next/router';
import { GetServerSidePropsContext, Redirect } from 'next';

import SurveyNotes from '~/components/SurveyNotes';
import SurveyComment from '~/components/SurveyComment';
import SurveySubmit from '~/components/SurveySubmit';

import { ISurvey } from '~/model/Survey';
import { ITarget } from '~/model/Target';

import { renderTemplate } from '~/util/renderTemplate';
import {
  withLayout,
  LayoutProps,
  getServerSidePropsFn,
} from '~/layouts/NPSSurveyLayout';

export const ctxSurveyIdGetter = (ctx: GetServerSidePropsContext): string =>
  ctx.params.id as string;

export const handle404 = (survey: ISurvey, target: ITarget): boolean =>
  !survey || !target;

export const handleRedirect = (survey: ISurvey): Redirect | null =>
  !survey.concluded
    ? null
    : {
        destination: `/survey/thanks?surveyId=${survey._id}`,
        permanent: false,
      };

export const getServerSideProps = getServerSidePropsFn({
  ctxSurveyIdGetter,
  handle404,
  handleRedirect,
});

interface SubmitData {
  surveyId: string;
  note: string;
  comment: string;
}

export type OpenNpsEvents = ReturnType<typeof useEvents>;
export const createSubmit = (
  data: SubmitData,
  router: NextRouter,
  setMissingNote: () => void,
  isSendingState: {
    isSending: boolean;
    setIsSending: (status: boolean) => void;
  },
  events: OpenNpsEvents
) => async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
  e.preventDefault();

  if (isSendingState.isSending) {
    return;
  }

  isSendingState.setIsSending(true);
  events.OpenNpsSubmit(data);
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

  if (response.status === 500) {
    setMissingNote();
    events.OpenNpsError(data);
    isSendingState.setIsSending(false);
  } else if (ok) {
    events.OpenNpsSuccess(data);
    router.push(`/survey/thanks?surveyId=${data.surveyId}`);
  }
};

const checkAndPostMessage = (shouldInvoke: boolean, title: string, data: Any) =>
  shouldInvoke &&
  window.parent.postMessage(
    JSON.stringify({ isOpenNps: true, title, data }),
    '*'
  );

export const useEvents = (shouldInvoke: boolean): AnyObject => ({
  OpenNpsChangeNote: ({ note }: SubmitData) =>
    checkAndPostMessage(shouldInvoke, 'OpenNpsChangeNote', note),
  OpenNpsChangeComment: ({ comment }: SubmitData) =>
    checkAndPostMessage(shouldInvoke, 'OpenNpsChangeComment', comment),
  OpenNpsSubmit: (data: SubmitData) =>
    checkAndPostMessage(shouldInvoke, 'OpenNpsSubmit', data),
  OpenNpsSuccess: (data: SubmitData) =>
    checkAndPostMessage(shouldInvoke, 'OpenNpsSuccess', data),
  OpenNpsLoad: (data: { reviewer: AnyObject; target: AnyObject }) =>
    checkAndPostMessage(shouldInvoke, 'OpenNpsLoad', data),
  OpenNpsError: (data: { reviewer: AnyObject; target: AnyObject }) =>
    checkAndPostMessage(shouldInvoke, 'OpenNpsError', data),
});

export const setValueForFieldInState = (
  state: AnyObject,
  setState: SimpleFn<AnyObject, void>
) => (field: string, mod: SimpleFn<AnyObject, void>) => (
  value: string
): void => {
  const newState = { ...state, [field]: value };
  setState(newState);
  mod(newState);
};

export const setErrorState = (
  state: AnyObject,
  setState: SimpleFn<AnyObject, void>
) => (error: string) => (): void => setState({ ...state, error });

export const SurveyPage: React.FC<LayoutProps> = ({
  themeOpts,
  templates,
  data,
  surveyId,
  layoutClasses,
  isIframe,
}): React.ReactElement => {
  const [state, setState] = useState({ note: null, comment: '', error: '' });
  const [isSending, setIsSending] = useState(false);
  const router = useRouter();
  const events = useEvents(process.browser && isIframe);
  const setError = setErrorState(state, setState);
  const onSubmit = createSubmit(
    { surveyId, ...state },
    router,
    setError(templates.MissingNoteError),
    { isSending, setIsSending },
    events
  );
  const setValueForField = setValueForFieldInState(state, setState);
  const handleClose = setError('');

  React.useEffect(() => {
    window.onload = function () {
      events.OpenNpsLoad(data);
    };
  });

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
      <Typography
        className={layoutClasses.corePhrase}
        data-cy="SurveyPageTypography"
        variant="h4"
        component="h4"
      >
        {renderTemplate(templates.CoreQuestionPhrase, data)}
      </Typography>
      <SurveyNotes
        themeOpts={themeOpts}
        setValue={setValueForField('note', events.OpenNpsChangeNote)}
        selected={state.note}
      />
      {templates.SurveyCommentText && (
        <Typography
          className={layoutClasses.commentPhrase}
          variant="h4"
          component="h4"
        >
          {renderTemplate(templates.SurveyCommentText, data)}
        </Typography>
      )}
      <SurveyComment
        value={state.comment}
        setValue={setValueForField('comment', events.OpenNpsChangeComment)}
        label={templates.SurveyCommentLabel}
        placeholder={templates.SurveyCommentPlaceholder}
      />
      <SurveySubmit themeOpts={themeOpts} isSending={isSending}>
        {templates.SendButtonMessage}
      </SurveySubmit>
      <Snackbar
        open={!!state.error}
        autoHideDuration={themeOpts.Error.duration}
        onClose={themeOpts.Error.closeOption && handleClose}
      >
        <Alert
          onClose={handleClose}
          severity="error"
          elevation={themeOpts.Error.elevation}
          variant="filled"
        >
          {state.error}
        </Alert>
      </Snackbar>
    </form>
  );
};

export default withLayout(SurveyPage);
