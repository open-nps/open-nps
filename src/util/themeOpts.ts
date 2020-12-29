export const DEFAULT_VALUES = {
  ResearchNotesBtnSize: 'medium',
  ResearchSubmitBtnSize: 'medium',
  ResearchSubmitBtnVariant: 'contained',
  ResearchNotesBtnColor: 'primary',
  ResearchSubmitBtnColor: 'primary',
};

export const AddThemeOptsDefaults = (
  themeOpts: Partial<ThemeOptionsConfigValues>
): ThemeOptionsConfigValues =>
  ({
    ...DEFAULT_VALUES,
    ...themeOpts,
  } as ThemeOptionsConfigValues);
