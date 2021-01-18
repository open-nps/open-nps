import React from 'react';
import Typography from '@material-ui/core/Typography';

import { GetServerSidePropsContext } from 'next';

import {
  withLayout,
  getServerSidePropsFn,
  LayoutProps,
} from '~/layouts/NPSSurveyLayout';
import { renderTemplate } from '~/util/renderTemplate';

export const ctxSurveyIdGetter = (ctx: GetServerSidePropsContext): string =>
  ctx.query.surveyId as string;

export const getServerSideProps = getServerSidePropsFn({
  ctxSurveyIdGetter,
  surveyExtraData: { concluded: true },
});

export const ThanksPage: React.FC<LayoutProps> = ({
  layoutClasses,
  templates,
  data,
}) => (
  <div className={layoutClasses.root}>
    <Typography data-cy="ThanksPageTypography" variant="h4" component="h4">
      {renderTemplate(templates.ThanksPhrase, data)}
    </Typography>
  </div>
);

export default withLayout(ThanksPage);
