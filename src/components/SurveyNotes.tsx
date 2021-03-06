import React from 'react';

import MUIButton from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import { withStyles, WithStyles, createStyles } from '@material-ui/styles';

/* istanbul ignore next */
export const Button = withStyles(() => ({
  root: {
    maxWidth: '36px',
    minWidth: '36px',
    fontSize: '16px',
  },
}))(MUIButton);

/* istanbul ignore next */
const styles = (theme) =>
  createStyles({
    buttonDiv: {
      display: 'grid',
      gridTemplateColumns: 'auto auto auto auto auto auto',
      maxWidth: '620px',
      width: '100%',
      justifyContent: 'space-around',
      flexWrap: 'wrap',

      '& > *': {
        marginBottom: theme.spacing(1),
      },

      '@media (min-width: 600px)': {
        display: 'flex',
      },
    },
  });

interface Props extends WithStyles<typeof styles> {
  themeOpts: ThemeOptionsConfigValues;
  selected?: number;
  setValue: SimpleFn<string, void>;
}

const renderNotes = (
  themeOpts: ThemeOptionsConfigValues,
  selected,
  setValue
): React.ReactNodeArray =>
  Object.keys(new Array(11).fill(1)).map((val) => {
    const note = parseInt(val);
    return (
      <Button
        key={`nps-${val}`}
        onClick={() => setValue(note)}
        size={themeOpts.SurveyNotesBtnSize}
        variant={note === selected ? 'contained' : 'outlined'}
        color={themeOpts.SurveyNotesBtnColor}
        data-cy="SurveyNoteBtn"
      >
        {note}
      </Button>
    );
  });

export const SurveyNotes: React.FC<Props> = ({
  themeOpts,
  selected,
  setValue,
  classes,
}) => {
  const noteElementsArr = renderNotes(themeOpts, selected, setValue);

  if (!themeOpts.SurveyNotesBtnGroupActive) {
    return <div className={classes.buttonDiv}>{noteElementsArr}</div>;
  }

  return <ButtonGroup>{noteElementsArr}</ButtonGroup>;
};

export default withStyles(styles)(SurveyNotes);
