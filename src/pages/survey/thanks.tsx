import React from 'react';
import get from 'lodash.get';
import Typography from '@material-ui/core/Typography';

import { ISurvey } from '~/model/Survey';
import { ITarget } from '~/model/Target';

import { GetServerSidePropsContext, Redirect } from 'next';

import {
  withLayout,
  getServerSidePropsFn,
  LayoutProps,
} from '~/layouts/NPSSurveyLayout';
import { renderTemplate } from '~/util/renderTemplate';

export const ctxSurveyIdGetter = (ctx: GetServerSidePropsContext): string =>
  ctx.query.surveyId as string;

export const handle404 = (survey: ISurvey, target: ITarget): boolean =>
  !survey || !target;

export const handleRedirect = (survey: ISurvey): Redirect | null =>
  survey.concluded
    ? null
    : {
        destination: `/survey/${survey._id}`,
        permanent: false,
      };

export const getServerSideProps = getServerSidePropsFn({
  ctxSurveyIdGetter,
  handle404,
  handleRedirect,
});

export const ThanksPage: React.FC<LayoutProps> = ({
  layoutClasses,
  templates,
  data,
  themeOpts,
}) => (
  <div className={layoutClasses.root}>
    {themeOpts.ThanksTopImage && (
      <div
        style={{
          maxWidth: get(themeOpts, 'ThanksTopImage.width', 'auto'),
        }}
        className={layoutClasses.brand}
      >
        <img
          alt={themeOpts.ThanksTopImage.alt}
          src={themeOpts.ThanksTopImage.url}
        />
      </div>
    )}
    <Typography data-cy="ThanksPageTypography" variant="h3" component="h3">
      {renderTemplate(templates.ThanksPhrase, data)}
    </Typography>
    {templates.ThanksSubPhrase && (
      <Typography variant="h4" component="h4">
        {renderTemplate(templates.ThanksSubPhrase, data)}
      </Typography>
    )}
  </div>
);

export default withLayout(ThanksPage);
