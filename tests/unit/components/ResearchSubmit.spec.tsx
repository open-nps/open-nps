import React from 'react';

import { shallow } from 'enzyme';

import { ResearchSubmit } from '~/components/ResearchSubmit';

describe('/src/components/ResearchNotes', () => {
  const baseProps = {
    themeOpts: {
      ResearchSubmitBtnColor: 'primary',
    } as ThemeOptionsConfigValues,
    children: 'FooBar',
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should render properly', () => {
    const wrap = shallow(<ResearchSubmit {...baseProps} />);

    expect(wrap).toHaveProp(
      'color',
      baseProps.themeOpts.ResearchSubmitBtnColor
    );
    expect(wrap).toHaveProp('variant', 'contained');
    expect(wrap).toHaveProp('type', 'submit');
    expect(wrap).toHaveText(baseProps.children);
  });
});
