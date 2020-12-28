import React from 'react';

import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';

const npsList = (new Array(10)).fill(1);

export const ResearchNotes = ({ setValue }) => (
  <ButtonGroup>
    {
      Object.keys(npsList).map((val) => {
        const note = parseInt(val) + 1;
        return (
          <Button
            key={`nps-${val}`}
            onClick={() => setValue(note)}
          >
            {note}
          </Button>
        )
      })
    }
  </ButtonGroup>
)
