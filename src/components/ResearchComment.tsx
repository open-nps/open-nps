import React from 'react';

import MUITextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/styles';

const TextField = withStyles((theme) => ({
  root: {
    marginTop: theme.spacing(3),
    width: '600px',
  },
}))(MUITextField);

interface Props {
  value: string;
  label: string;
  placeholder?: string;
  setValue: SimpleFn<string, void>;
}
export const ResearchComment: React.FC<Props> = ({
  value,
  setValue,
  label,
  placeholder = '',
}) => (
  <TextField
    multiline
    variant="outlined"
    color="primary"
    onChange={(e) => {
      setValue(e.target.value);
    }}
    value={value}
    label={label}
    placeholder={placeholder}
    rows={3}
    rowsMax={6}
  />
);

export default ResearchComment;
