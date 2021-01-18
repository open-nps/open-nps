import React from 'react';

import { shallow } from 'enzyme';

import { SurveySubmit } from '~/components/SurveySubmit';

describe('/src/components/SurveyNotes', () => {
  const baseProps = {
    themeOpts: {
      SurveySubmitBtnColor: 'primary',
    } as ThemeOptionsConfigValues,
    children: 'FooBar',
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should render properly', () => {
    const wrap = shallow(<SurveySubmit {...baseProps} />);

    expect(wrap).toHaveProp('color', baseProps.themeOpts.SurveySubmitBtnColor);
    expect(wrap).toHaveProp('variant', 'contained');
    expect(wrap).toHaveProp('type', 'submit');
    expect(wrap).toHaveText(baseProps.children);
  });
});
