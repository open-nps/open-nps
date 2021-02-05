import React from 'react';

import { shallow } from 'enzyme';

import { SurveySubmit } from '~/components/SurveySubmit';

describe('/src/components/SurveyNotes', () => {
  const baseProps = {
    themeOpts: {
      SurveySubmitBtnColor: 'primary',
    } as ThemeOptionsConfigValues,
    children: 'FooBar',
    isSending: false,
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should render properly', () => {
    const wrap = shallow(<SurveySubmit {...baseProps} />);
    expect(wrap).toMatchSnapshot();
  });

  it('should render properly with isSending === true', () => {
    const wrap = shallow(<SurveySubmit {...baseProps} isSending={true} />);
    expect(wrap).toMatchSnapshot();
  });
});
