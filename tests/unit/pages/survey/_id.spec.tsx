import React from 'react';
import get from 'lodash.get';

import {
  createSubmit,
  setValueForFieldInState,
  SurveyPage,
  ctxSurveyIdGetter,
  OpenNpsEvents,
  useEvents,
  handle404,
  handleRedirect,
} from '~/pages/survey/[id]';
import { NextRouter } from 'next/router';
import { shallow } from 'enzyme';
import { LayoutProps } from '~/layouts/NPSSurveyLayout';
import { GetServerSidePropsContext } from 'next';

import { ISurvey } from '~/model/Survey';
import { ITarget } from '~/model/Target';

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
      onload: null,
      location: {
        origin: 'foobar',
      },
      parent: {
        postMessage: jest.fn(),
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

    const fakeEvents = ({
      OpenNpsSubmit: jest.fn(),
      OpenNpsSuccess: jest.fn(),
    } as unknown) as OpenNpsEvents;

    const baseAsserts = (response) => {
      expect(fakeEvents.OpenNpsSubmit).toHaveBeenCalledTimes(1);
      expect(fakeEvents.OpenNpsSubmit).toHaveBeenCalledWith(fakeData);

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
      const onSubmit = createSubmit(fakeData, router, fakeEvents);
      const response = createResponse({ ok: 1 });

      await onSubmit(fakeEvent);

      baseAsserts(response);
      expect(fakeEvents.OpenNpsSuccess).toHaveBeenCalledTimes(1);
      expect(fakeEvents.OpenNpsSuccess).toHaveBeenCalledWith(fakeData);
      expect(router.push).toHaveBeenCalledTimes(1);
      expect(router.push).toHaveBeenCalledWith(
        `/survey/thanks?surveyId=${fakeData.surveyId}`
      );
    });

    it('should createSubmit right and not trigger new route', async () => {
      const onSubmit = createSubmit(fakeData, router, fakeEvents);
      const response = createResponse({ ok: 0 });

      await onSubmit(fakeEvent);

      baseAsserts(response);
      expect(fakeEvents.OpenNpsSuccess).not.toHaveBeenCalledTimes(1);
      expect(fakeEvents.OpenNpsSuccess).not.toHaveBeenCalledWith(fakeData);
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
      const mod = jest.fn();

      setValueForFieldInState(state, setState)(field, mod)(value);

      expect(setState).toHaveBeenCalledTimes(1);
      expect(setState).toHaveBeenCalledWith({ ...state, [field]: value });
      expect(mod).toHaveBeenCalledTimes(1);
      expect(mod).toHaveBeenCalledWith({ ...state, [field]: value });
    });
  });

  describe('Page Component (SurveyPage)', () => {
    it('should render properly', () => {
      (process as Any).browser = true;

      const props = ({
        isIframe: true,
        templates: {
          CoreQuestionPhrase: 'Foo Bar',
          SurveyCommentLabel: 'Fizz',
          SurveyCommentPlaceholder: 'Fuzz',
          SurveyCommentText: 'Fizz Fuzz',
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

      const useEffect = jest.spyOn(React, 'useEffect');

      const wrap = shallow(<SurveyPage {...props} />);
      useEffect.mock.calls[0][0]();
      window.onload({} as Any);

      expect(wrap).toMatchSnapshot();
      expect(useEffect).toHaveBeenCalledTimes(1);
    });

    it('ctxSurveyIdGetter', () => {
      const ctx = ({
        params: { id: 'foo' },
      } as unknown) as GetServerSidePropsContext;
      expect(ctxSurveyIdGetter(ctx)).toBe(ctx.params.id);
    });
  });

  describe('useEvents', () => {
    const createMessage = (title: string, data: Any) =>
      JSON.stringify({ isOpenNps: true, title, data });

    const createUseEventsTest = ({ willExecute }: { willExecute: boolean }) => {
      const events = useEvents(willExecute);
      const initialSurvey = {
        reviewer: { name: 'foo' },
        target: { name: 'bar' },
      };
      const survey = {
        surveyId: 'foo',
        note: 6,
        comment: 'fizz fuzz',
      } as Any;

      events.OpenNpsChangeNote(survey);
      events.OpenNpsChangeComment(survey);
      events.OpenNpsSubmit(survey);
      events.OpenNpsSuccess(survey);
      events.OpenNpsLoad(initialSurvey);

      const expecter = get(
        expect(global.window.parent.postMessage),
        willExecute ? 'toHaveBeenNthCalledWith' : 'not.toHaveBeenNthCalledWith'
      );

      expect(global.window.parent.postMessage).toHaveBeenCalledTimes(
        willExecute ? 5 : 0
      );
      expecter(1, createMessage('OpenNpsChangeNote', survey.note), '*');
      expecter(2, createMessage('OpenNpsChangeComment', survey.comment), '*');
      expecter(3, createMessage('OpenNpsSubmit', survey), '*');
      expecter(4, createMessage('OpenNpsSuccess', survey), '*');
      expecter(5, createMessage('OpenNpsLoad', initialSurvey), '*');
    };

    it('should create events and not execute them', () => {
      createUseEventsTest({ willExecute: false });
    });

    it('should create events and execute them', () => {
      createUseEventsTest({ willExecute: true });
    });
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
    expect(handleRedirect({ _id, concluded: false } as ISurvey)).toBe(null);
    expect(handleRedirect({ _id, concluded: true } as ISurvey)).toEqual({
      destination: `/survey/thanks?surveyId=${_id}`,
      permanent: false,
    });
  });
});
