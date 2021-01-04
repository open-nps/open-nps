import React from 'react';
import Typography from '@material-ui/core/Typography';

import { GetServerSidePropsContext } from 'next';

import {
  withLayout,
  getServerSidePropsFn,
  LayoutProps,
} from '~/layouts/NPSResearchLayout';
import { template } from '~/util/template';

export const ctxResearchIdGetter = (ctx: GetServerSidePropsContext): string =>
  ctx.query.researchId as string;

export const getServerSideProps = getServerSidePropsFn({
  ctxResearchIdGetter,
  researchExtraData: { concluded: true },
});

export const ThanksPage: React.FC<LayoutProps> = ({
  layoutClasses,
  templates,
  data,
}) => (
  <div className={layoutClasses.root}>
    <Typography variant="h4" component="h4">
      {template(templates.ThanksPhrase, data)}
    </Typography>
  </div>
);

export default withLayout(ThanksPage);
