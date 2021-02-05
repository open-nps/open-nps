import React from 'react';

import MUIButton from '@material-ui/core/Button';
import MUICircularProgress from '@material-ui/core/CircularProgress';
import { withStyles, createStyles } from '@material-ui/styles';

interface Props {
  children: React.ReactChild;
  themeOpts: ThemeOptionsConfigValues;
  isSending: boolean;
}

/* istanbul ignore next */
const btnStyles = (theme) =>
  createStyles({
    root: {
      marginTop: theme.spacing(3),
      maxWidth: '600px',
    },
  });

/* istanbul ignore next */
const loadStyles = () =>
  createStyles({
    root: {},
  });

const Button = withStyles(btnStyles)(MUIButton);
const CircularProgress = withStyles(loadStyles)(MUICircularProgress);

export const SurveySubmit: React.FC<Props> = ({
  isSending,
  themeOpts,
  children,
}) => (
  <Button
    color={themeOpts.SurveySubmitBtnColor}
    variant="contained"
    type="submit"
    data-cy="SurveySubmit"
    fullWidth={themeOpts.SurveySubmitBtnFullWidth}
    disabled={isSending}
  >
    {isSending ? (
      <CircularProgress size={themeOpts.SurveySubmitBtnLoadSize} />
    ) : (
      children
    )}
  </Button>
);

export default SurveySubmit;
