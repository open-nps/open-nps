import React from 'react';

import TextField from '@material-ui/core/TextField';

export const ResearchComment = ({ value, setValue }) => (
  <TextField
    multiline
    variant="outlined"
    onChange={(e) => { setValue(e.target.value) }}
    value={value}
  />
)
