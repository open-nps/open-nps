import React from 'react';

import {
  ThanksPage,
  ctxSurveyIdGetter,
  handle404,
  handleRedirect,
} from '~/pages/survey/thanks';
import { LayoutProps } from '~/layouts/NPSSurveyLayout';
import { shallow } from 'enzyme';
import { GetServerSidePropsContext } from 'next';

import { ISurvey } from '~/model/Survey';
import { ITarget } from '~/model/Target';

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

  it('handle404', () => {
    const fakeSurvey = {
      _id: '123',
      reviewer: {},
      concluded: false,
    } as ISurvey;
    const fakeTarget = { _id: '123', name: 'opennps' } as ITarget;
    expect(handle404(null, null)).toBe(true);
    expect(handle404(fakeSurvey, null)).toBe(true);
    expect(handle404(null, fakeTarget)).toBe(true);
    expect(handle404(fakeSurvey, fakeTarget)).toBe(false);
  });

  it('handleRedirect', () => {
    const _id = '123';
    expect(handleRedirect({ _id, concluded: true } as ISurvey)).toBe(null);
    expect(handleRedirect({ _id, concluded: false } as ISurvey)).toEqual({
      destination: `/survey/${_id}`,
      permanent: false,
    });
  });
});
