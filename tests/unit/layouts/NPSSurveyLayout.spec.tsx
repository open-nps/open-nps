jest.mock('../../../src/util/mongo');
jest.mock('../../../src/model');
jest.mock('@material-ui/core/styles', () => {
  const actual = jest.requireActual('@material-ui/core/styles');
  return { ...actual, createMuiTheme: jest.fn() };
});

import React from 'react';
import { shallow } from 'enzyme';
import { GetServerSidePropsContext } from 'next';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import {
  withLayout,
  getServerSidePropsFn,
  LayoutProps,
} from '~/layouts/NPSSurveyLayout';
import { Target, Survey } from '~/model';
import { AddThemeOptsDefaults } from '~/util/themeOpts';

describe('/src/layouts/NPSSurveyLayout', () => {
  let handle;
  const getOverrideConfigs = jest.fn();
  const surveyExtraData = { concluded: false };
  const fakeCtxId = 'foo';
  const fakeCtx = ({
    foo: 'bar',
    query: {},
  } as unknown) as GetServerSidePropsContext;
  const fakeMuiValue = { a: 1 };
  const fakeTemplateValue = {
    CoreQuestionPhrase: 'a',
    ThanksPhrase: 'b',
    SendButtonMessage: 'c',
  };
  const fakeConfigs = [
    { key: 'mui', values: fakeMuiValue },
    { key: 'templates', values: fakeTemplateValue },
  ];
  const fakeTargetId = 'fizz';
  const fakeReviewer = { id: '1', name: 'bar' };
  const fakeSurvey = {
    target: fakeTargetId,
    reviewer: fakeReviewer,
    getOverrideConfigs,
  };
  const fakeTarget = {
    meta: { c: 1 },
    configs: fakeConfigs,
  };

  const simulatePopulate = (
    mock: jest.Mock,
    finalResponse: AnyObject
  ): jest.Mock => {
    const populate = jest.fn().mockResolvedValue(finalResponse);
    mock.mockReturnValue({ populate });
    return populate;
  };

  const baseAsserts = (targetPopulate?: jest.Mock) => {
    expect(Survey.findOne).toHaveBeenCalledTimes(1);
    expect(Survey.findOne).toHaveBeenCalledWith({
      _id: fakeCtxId,
      ...surveyExtraData,
    });

    if (targetPopulate) {
      expect(Target.findById).toHaveBeenCalledTimes(1);
      expect(Target.findById).toHaveBeenCalledWith(fakeTargetId);
      expect(targetPopulate).toHaveBeenCalledTimes(1);
    }
  };

  beforeEach(() => {
    handle = getServerSidePropsFn({
      ctxSurveyIdGetter: jest.fn().mockReturnValue(fakeCtxId),
      surveyExtraData,
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should return a handle from getServerSidePropsFn and its return props', async () => {
    const targetPopulate = simulatePopulate(
      Target.findById as jest.Mock,
      fakeTarget
    );
    fakeSurvey.getOverrideConfigs.mockResolvedValue([]);
    (Survey.findOne as jest.Mock).mockResolvedValue(fakeSurvey);

    const res: AnyObject = await handle(fakeCtx);

    baseAsserts(targetPopulate);
    expect(res).not.toHaveProperty('notFound');
    expect(res.props).toHaveProperty('mui', fakeMuiValue);
    expect(res.props).toHaveProperty('isIframe', false);
    expect(res.props).toHaveProperty('templates', fakeTemplateValue);
    expect(res.props).toHaveProperty('themeOpts', AddThemeOptsDefaults({}));
    expect(res.props).toHaveProperty('surveyId', fakeCtxId);
    expect(res.props.data).toHaveProperty('reviewer', fakeReviewer);
    expect(res.props.data).toHaveProperty('target', fakeTarget.meta);
  });

  it('should return a handle from getServerSidePropsFn and its return props overrides by tags', async () => {
    const fakeMuiNewConfig = { a: 2 };
    fakeSurvey.getOverrideConfigs.mockResolvedValue([
      [{ values: fakeMuiNewConfig, key: 'mui', alias: 'foobar' }],
    ]);
    (Survey.findOne as jest.Mock).mockResolvedValue(fakeSurvey);
    const targetPopulate = simulatePopulate(
      Target.findById as jest.Mock,
      fakeTarget
    );

    fakeCtx.query.iframe = '';
    const res: AnyObject = await handle(fakeCtx);

    baseAsserts(targetPopulate);
    expect(res).not.toHaveProperty('notFound');
    expect(res.props).toHaveProperty('mui', fakeMuiNewConfig);
    expect(res.props).toHaveProperty('isIframe', true);
    expect(res.props).toHaveProperty('templates', fakeTemplateValue);
    expect(res.props).toHaveProperty('themeOpts', AddThemeOptsDefaults({}));
    expect(res.props).toHaveProperty('surveyId', fakeCtxId);
    expect(res.props.data).toHaveProperty('reviewer', fakeReviewer);
    expect(res.props.data).toHaveProperty('target', fakeTarget.meta);
  });

  it('should return a handle from getServerSidePropsFn and its return notFound for survey', async () => {
    fakeSurvey.getOverrideConfigs.mockResolvedValue([]);
    (Survey.findOne as jest.Mock).mockResolvedValue(null);
    simulatePopulate(Target.findById as jest.Mock, fakeTarget);

    const res: AnyObject = await handle(fakeCtx);

    baseAsserts();
    expect(res).not.toHaveProperty('props');
    expect(res).toHaveProperty('notFound', true);
  });

  it('should return a handle from getServerSidePropsFn and its return notFound for target', async () => {
    fakeSurvey.getOverrideConfigs.mockResolvedValue([]);
    (Survey.findOne as jest.Mock).mockResolvedValue(fakeSurvey);
    const targetPopulate = simulatePopulate(Target.findById as jest.Mock, null);

    const res: AnyObject = await handle(fakeCtx);

    baseAsserts(targetPopulate);
    expect(res).not.toHaveProperty('props');
    expect(res).toHaveProperty('notFound', true);
  });

  it('should withLayout return a valid React.FC', () => {
    const otherProps = ({ b: 2, c: 3 } as unknown) as LayoutProps;
    const props = { mui: { a: 1 }, themeOpts: {}, ...otherProps };
    const MyComponent = () => <div>Test</div>;
    const WithLayout = withLayout(MyComponent);
    const createMuiThemeRes = { a: 1 };

    (createMuiTheme as jest.Mock).mockReturnValue(createMuiThemeRes);
    const wrap = shallow(<WithLayout {...props} />);

    expect(createMuiTheme).toHaveBeenCalledTimes(1);
    expect(createMuiTheme).toHaveBeenCalledWith(props.mui);
    expect(wrap).toContainMatchingElement('MyComponent');
    expect(wrap).toContainMatchingElement('ThemeProvider');
    expect(wrap.find(ThemeProvider)).toHaveProp('theme', createMuiThemeRes);

    Object.keys(otherProps).forEach((key) =>
      expect(wrap.find(MyComponent)).toHaveProp(key, otherProps[key])
    );
  });
});
