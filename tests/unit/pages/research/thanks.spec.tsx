import React from 'react';

import { ThanksPage, ctxResearchIdGetter } from '~/pages/research/thanks';
import { LayoutProps } from '~/layouts/NPSResearchLayout';
import { shallow } from 'enzyme';
import { GetServerSidePropsContext } from 'next';

describe('/src/pages/research/thanks', () => {
  it('should render properly', () => {
    const props = ({
      templates: {
        ThanksPhrase: 'Foo Bar',
      },
      researchId: 'fake',
      themeOpts: {
        a: 1,
      },
      data: {
        b: 1,
      },
      layoutClasses: {
        root: 'root',
      },
    } as unknown) as LayoutProps;

    const wrap = shallow(<ThanksPage {...props} />);
    expect(wrap).toMatchSnapshot();
  });

  it('ctxResearchIdGetter', () => {
    const ctx = ({
      query: { researchId: 'foo' },
    } as unknown) as GetServerSidePropsContext;
    expect(ctxResearchIdGetter(ctx)).toBe(ctx.query.researchId);
  });
});
