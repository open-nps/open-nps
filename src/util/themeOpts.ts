export const DEFAULT_VALUES = {
  SurveyNotesBtnSize: 'medium',
  SurveySubmitBtnSize: 'medium',
  SurveySubmitBtnVariant: 'contained',
  SurveySubmitBtnLoadSize: 28,
  SurveyNotesBtnColor: 'primary',
  SurveySubmitBtnColor: 'primary',
  SurveyBoxBorderSize: '0px',
  SurveyBoxBorderRadius: '0px',
  Error: {
    duration: 6000,
    closeOption: true,
    elevation: 6,
  },
};

export const AddThemeOptsDefaults = (
  themeOpts: Partial<ThemeOptionsConfigValues>
): ThemeOptionsConfigValues =>
  ({
    ...DEFAULT_VALUES,
    ...themeOpts,
  } as ThemeOptionsConfigValues);
