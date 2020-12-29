export const AddThemeOptsDefaults = (
  themeOpts: ThemeOptionsConfigValues
): ThemeOptionsConfigValues => ({
  ResearchNotesBtnSize: 'medium',
  ResearchSubmitBtnSize: 'medium',
  ResearchSubmitBtnVariant: 'contained',
  ResearchNotesBtnColor: 'primary',
  ResearchSubmitBtnColor: 'primary',
  ...themeOpts,
});
