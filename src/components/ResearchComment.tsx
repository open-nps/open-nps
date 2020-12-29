import React from 'react';

import MUITextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/styles';
import { ThemeOptions } from '@material-ui/core';

const TextField = withStyles((theme) => ({
  root: {
    marginTop: theme.spacing(3),
    width: '600px',
  }
}))(MUITextField);

export const ResearchComment = ({ value, setValue, label, placeholder }) => (
  <TextField
    multiline
    variant="outlined"
    color="primary"
    onChange={(e) => { setValue(e.target.value) }}
    value={value}
    label={label}
    placeholder={placeholder}
    rows={3}
    rowsMax={6}
  />
)

export default ResearchComment;
