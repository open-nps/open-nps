import React from 'react';

import { ThanksPage, ctxSurveyIdGetter } from '~/pages/survey/thanks';
import { LayoutProps } from '~/layouts/NPSSurveyLayout';
import { shallow } from 'enzyme';
import { GetServerSidePropsContext } from 'next';

describe('/src/pages/survey/thanks', () => {
  it('should render properly', () => {
    const props = ({
      templates: {
        ThanksPhrase: 'Foo Bar',
        ThanksSubPhrase: 'Fizz Fuzz',
      },
      surveyId: 'fake',
      themeOpts: {
        ThanksTopImage: {
          url: 'aaaa',
          alt: 'bbbb',
        },
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

  it('ctxSurveyIdGetter', () => {
    const ctx = ({
      query: { surveyId: 'foo' },
    } as unknown) as GetServerSidePropsContext;
    expect(ctxSurveyIdGetter(ctx)).toBe(ctx.query.surveyId);
  });
});
