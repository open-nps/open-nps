import React from 'react';

import MUIButton from '@material-ui/core/Button';
import { withStyles } from '@material-ui/styles';

interface Props {
  children: React.ReactChild;
  themeOpts: ThemeOptionsConfigValues;
}

const Button = withStyles((theme) => ({
  root: {
    marginTop: theme.spacing(3),
    width: '600px',
  },
}))(MUIButton);

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
