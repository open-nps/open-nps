import React from 'react';

import MUITextField from '@material-ui/core/TextField';
import { withStyles, createStyles } from '@material-ui/styles';

/* istanbul ignore next */
const styles = (theme) =>
  createStyles({
    root: {
      marginTop: theme.spacing(2),
      maxWidth: '600px',
      width: '100%',
    },
  });

const TextField = withStyles(styles)(MUITextField);

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
    data-cy="ResearchComment"
  />
);

export default ResearchComment;
