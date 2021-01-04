import React from 'react';
import Typography from '@material-ui/core/Typography';

import { GetServerSidePropsContext } from 'next';

import {
  withLayout,
  getServerSidePropsFn,
  LayoutProps,
} from '~/layouts/NPSResearchLayout';
import { template } from '~/util/template';

export const getServerSideProps = getServerSidePropsFn({
  ctxResearchIdGetter: (ctx: GetServerSidePropsContext) =>
    ctx.query.researchId as string,
  researchExtraData: { concluded: true },
});

export const ThanksPage: React.FC<LayoutProps> = ({
  layoutClasses,
  templates,
  data,
}) => (
  <div className={layoutClasses.root}>
    <Typography variant="h2" component="h2">
      {template(templates.ThanksPhrase, data)}
    </Typography>
  </div>
);

export default withLayout(ThanksPage);
