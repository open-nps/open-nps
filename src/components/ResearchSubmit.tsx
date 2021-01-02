import React from 'react';

import MUIButton from '@material-ui/core/Button';
import { withStyles, createStyles } from '@material-ui/styles';

interface Props {
  children: React.ReactChild;
  themeOpts: ThemeOptionsConfigValues;
}

/* istanbul ignore next */
const styles = (theme) =>
  createStyles({
    root: {
      marginTop: theme.spacing(3),
      width: '600px',
    },
  });

const Button = withStyles(styles)(MUIButton);

export const ResearchSubmit: React.FC<Props> = ({ themeOpts, children }) => (
  <Button
    color={themeOpts.ResearchSubmitBtnColor}
    variant="contained"
    type="submit"
  >
    {children}
  </Button>
);

export default ResearchSubmit;
