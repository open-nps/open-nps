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
      maxWidth: '600px',
    },
  });

const Button = withStyles(styles)(MUIButton);

export const SurveySubmit: React.FC<Props> = ({ themeOpts, children }) => (
  <Button
    color={themeOpts.SurveySubmitBtnColor}
    variant="contained"
    type="submit"
    data-cy="SurveySubmit"
    fullWidth={themeOpts.SurveySubmitBtnFullWidth}
  >
    {children}
  </Button>
);

export default SurveySubmit;
