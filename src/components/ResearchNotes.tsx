import React from 'react';

import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import { withStyles, WithStyles, createStyles } from '@material-ui/styles';

/* istanbul ignore next */
const styles = (theme) =>
  createStyles({
    buttonDiv: {
      maxWidth: '700px',
      width: '100%',
      display: 'flex',
      justifyContent: 'space-around',
      flexWrap: 'wrap',

      '& > *': {
        marginBottom: theme.spacing(1),
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
  Object.keys(new Array(10).fill(1)).map((val) => {
    const note = parseInt(val) + 1;
    return (
      <Button
        key={`nps-${val}`}
        onClick={() => setValue(note)}
        size={themeOpts.ResearchNotesBtnSize}
        variant={note === selected ? 'contained' : 'outlined'}
        color={themeOpts.ResearchNotesBtnColor}
        data-cy="ResearchNoteBtn"
      >
        {note}
      </Button>
    );
  });

export const ResearchNotes: React.FC<Props> = ({
  themeOpts,
  selected,
  setValue,
  classes,
}) => {
  const noteElementsArr = renderNotes(themeOpts, selected, setValue);

  if (!themeOpts.ResearchNotesBtnGroupActive) {
    return <div className={classes.buttonDiv}>{noteElementsArr}</div>;
  }

  return <ButtonGroup>{noteElementsArr}</ButtonGroup>;
};

export default withStyles(styles)(ResearchNotes);
