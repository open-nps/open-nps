import React from 'react';
import ButtonGroup from '@material-ui/core/ButtonGroup';

import { shallow } from 'enzyme';

import { SurveyNotes, Button } from '~/components/SurveyNotes';

describe('/src/components/SurveyNotes', () => {
  const baseProps = {
    themeOpts: {
      SurveyNotesBtnGroupActive: false,
    } as ThemeOptionsConfigValues,
    classes: { buttonDiv: 'buttonDiv' },
    setValue: jest.fn(),
  };

  type AssertOpts = {
    selected?: number;
    isBtnGroup?: boolean;
  };

  const basicAsserts = (wrap, { selected, isBtnGroup }: AssertOpts = {}) => {
    const buttons = wrap.find(Button);
    expect(buttons).toHaveLength(11);

    if (selected) {
      expect(buttons.at(selected)).toHaveProp('variant', 'contained');
    } else {
      buttons.forEach((btn) => {
        expect(btn).toHaveProp('variant', 'outlined');
      });
    }

    if (!isBtnGroup) {
      expect(wrap).toHaveClassName(baseProps.classes.buttonDiv);
    } else {
      expect(wrap.find(ButtonGroup)).not.toBeEmptyRender();
    }
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should render properly', () => {
    const wrap = shallow(<SurveyNotes {...baseProps} />);
    basicAsserts(wrap);
  });

  it('should render properly with selected', () => {
    const selected = 3;
    const wrap = shallow(<SurveyNotes {...baseProps} selected={selected} />);

    basicAsserts(wrap, { selected });
  });

  it('should render properly with ButtonGroup', () => {
    const props = {
      ...baseProps,
      themeOpts: { ...baseProps.themeOpts, SurveyNotesBtnGroupActive: true },
    };
    const wrap = shallow(<SurveyNotes {...props} />);
    basicAsserts(wrap, { isBtnGroup: true });
  });

  it('should setValue correctly', () => {
    const selected = 2;
    const wrap = shallow(<SurveyNotes {...baseProps} />);
    basicAsserts(wrap);

    wrap.find(Button).at(selected).simulate('click');

    expect(baseProps.setValue).toHaveBeenCalledWith(selected);
  });
});
