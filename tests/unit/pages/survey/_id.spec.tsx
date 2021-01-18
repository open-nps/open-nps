import React from 'react';

import {
  createSubmit,
  setValueForFieldInState,
  SurveyPage,
  ctxSurveyIdGetter,
} from '~/pages/survey/[id]';
import { NextRouter } from 'next/router';
import { shallow } from 'enzyme';
import { LayoutProps } from '~/layouts/NPSSurveyLayout';
import { GetServerSidePropsContext } from 'next';

describe('/src/pages/survey/[id]', () => {
  const fetch = global.fetch;

  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  beforeAll(() => {
    global.window = ({
      location: {
        origin: 'foobar',
      },
    } as unknown) as Window & typeof globalThis;
  });

  afterAll(() => {
    global.fetch = fetch;
  });

  describe('createSubmit', () => {
    const router = ({ push: jest.fn() } as unknown) as NextRouter;
    const fakeData = { surveyId: 'foo', note: '5', comment: 'bar' };
    const fakeEvent = ({
      preventDefault: jest.fn(),
    } as unknown) as React.FormEvent<HTMLFormElement>;
    const createResponse = (obj: AnyObject) => {
      const response = { json: jest.fn().mockResolvedValue(obj) };
      (global.fetch as jest.Mock).mockResolvedValue(response);
      return response;
    };

    const baseAsserts = (response) => {
      expect(response.json).toHaveBeenCalledTimes(1);
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(global.fetch).toHaveBeenCalledWith(
        `${global.window.location.origin}/api/survey/conclude`,
        {
          method: 'PUT',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(fakeData),
        }
      );
    };

    it('should createSubmit right and trigger new route', async () => {
      const onSubmit = createSubmit(fakeData, router);
      const response = createResponse({ ok: 1 });

      await onSubmit(fakeEvent);

      baseAsserts(response);
      expect(router.push).toHaveBeenCalledTimes(1);
      expect(router.push).toHaveBeenCalledWith(
        `/survey/thanks?surveyId=${fakeData.surveyId}`
      );
    });

    it('should createSubmit right and not trigger new route', async () => {
      const onSubmit = createSubmit(fakeData, router);
      const response = createResponse({ ok: 0 });

      await onSubmit(fakeEvent);

      baseAsserts(response);
      expect(router.push).not.toHaveBeenCalledTimes(1);
      expect(router.push).not.toHaveBeenCalledWith(
        `/survey/thanks?surveyId=${fakeData.surveyId}`
      );
    });
  });

  describe('setValueForFieldInState', () => {
    it('should set correctly value', () => {
      const field = 'foo';
      const value = 'bar';
      const oldValue = 'fizz';
      const setState = jest.fn();
      const state = { preserve: 'fuzz', [field]: oldValue };

      setValueForFieldInState(state, setState)(field)(value);

      expect(setState).toHaveBeenCalledTimes(1);
      expect(setState).toHaveBeenCalledWith({ ...state, [field]: value });
    });
  });

  describe('Page Component (SurveyPage)', () => {
    it('should render properly', () => {
      const props = ({
        templates: {
          CoreQuestionPhrase: 'Foo Bar',
          SurveyCommentLabel: 'Fizz',
          SurveyCommentPlaceholder: 'Fuzz',
        },
        surveyId: 'fake',
        themeOpts: {
          SurveyTopBrandImage: {
            url: 'a',
            alt: 'b',
          },
        },
        data: {
          b: 1,
        },
        layoutClasses: {
          root: 'root',
        },
      } as unknown) as LayoutProps;

      const wrap = shallow(<SurveyPage {...props} />);
      expect(wrap).toMatchSnapshot();
    });

    it('ctxSurveyIdGetter', () => {
      const ctx = ({
        params: { id: 'foo' },
      } as unknown) as GetServerSidePropsContext;
      expect(ctxSurveyIdGetter(ctx)).toBe(ctx.params.id);
    });
  });
});
