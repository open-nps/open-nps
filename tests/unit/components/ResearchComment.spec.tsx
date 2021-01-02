import React from 'react';
import { shallow } from 'enzyme';

import ResearchComment from '~/components/ResearchComment';

describe('/src/components/ResearchComment', () => {
  const baseProps = {
    label: 'foo',
    value: '',
    setValue: jest.fn(),
  };

  const basicAsserts = (wrap, props = { placeholder: '' }) => {
    const assertive = { ...baseProps, ...props };

    expect(wrap).toHaveProp('multiline', true);
    expect(wrap).toHaveProp('variant', 'outlined');
    expect(wrap).toHaveProp('rows', 3);
    expect(wrap).toHaveProp('rowsMax', 6);
    expect(wrap).toHaveProp('color', 'primary');
    expect(wrap).toHaveProp('value', assertive.value);
    expect(wrap).toHaveProp('label', assertive.label);
    expect(wrap).toHaveProp('placeholder', assertive.placeholder);
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should render properly without placeholder', () => {
    const wrap = shallow(<ResearchComment {...baseProps} />);
    basicAsserts(wrap);
  });

  it('should render properly with placeholder', () => {
    const placeholder = 'foobar';
    const wrap = shallow(
      <ResearchComment {...baseProps} placeholder={placeholder} />
    );
    basicAsserts(wrap, { placeholder });
  });

  it('should render call set value', () => {
    const fakeValue = 'fizz';
    const wrap = shallow(<ResearchComment {...baseProps} />);
    basicAsserts(wrap);

    wrap.simulate('change', { target: { value: fakeValue } });
    expect(baseProps.setValue).toHaveBeenCalledWith(fakeValue);
  });
});
