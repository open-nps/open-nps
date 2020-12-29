import React from 'react';

import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import { withStyles, WithStyles, createStyles } from '@material-ui/styles';

const styles = () =>
  createStyles({
    buttonDiv: {
      width: '100%',
      display: 'flex',
      justifyContent: 'space-around',
    },
  });

interface Props extends WithStyles<typeof styles> {
  themeOpts: ThemeOptionsConfigValues;
  selected: number;
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
}) =>
  !themeOpts.ResearchNotesBtnGroupActive ? (
    <div className={classes.buttonDiv}>
      {renderNotes(themeOpts, selected, setValue)}
    </div>
  ) : (
    <ButtonGroup>{renderNotes(themeOpts, selected, setValue)}</ButtonGroup>
  );

export default withStyles(styles)(ResearchNotes);
