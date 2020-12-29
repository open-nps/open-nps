import React from 'react';

import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';

interface Props {
  themeOpts: ThemeOptionsConfigValues;
  setValue: (value: string) => any;
}

const renderNotes = (themeOpts: ThemeOptionsConfigValues, setValue) => Object.keys(
  (new Array(10)).fill(1)
).map((val) => {
  const note = parseInt(val) + 1;
  return (
    <Button
      key={`nps-${val}`}
      onClick={() => setValue(note)}
      size={themeOpts.ResearchNotesBtnSize}
      variant={themeOpts.ResearchNotesBtnVariant}
      color="primary"
    >
      {note}
    </Button>
  )
})

export const ResearchNotes = ({ themeOpts, setValue }: Props) =>
  !themeOpts.ResearchNotesBtnGroupActive
  ? (<div>{ renderNotes(themeOpts, setValue) }</div>)
  : (
    <ButtonGroup
      variant={themeOpts.ResearchNotesBtnVariant}
      size={themeOpts.ResearchNotesBtnSize}
    >
      { renderNotes(themeOpts, setValue) }
    </ButtonGroup>);
