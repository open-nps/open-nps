export const DEFAULT_VALUES = {
  SurveyNotesBtnSize: 'medium',
  SurveySubmitBtnSize: 'medium',
  SurveySubmitBtnVariant: 'contained',
  SurveyNotesBtnColor: 'primary',
  SurveySubmitBtnColor: 'primary',
  SurveyBoxBorderSize: '0px',
  SurveyBoxBorderRadius: '0px',
};

export const AddThemeOptsDefaults = (
  themeOpts: Partial<ThemeOptionsConfigValues>
): ThemeOptionsConfigValues =>
  ({
    ...DEFAULT_VALUES,
    ...themeOpts,
  } as ThemeOptionsConfigValues);
