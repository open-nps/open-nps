import { DEFAULT_VALUES, AddThemeOptsDefaults } from '~/util/themeOpts';

describe('/util/themeOpts', () => {
  it('should exec AddThemeOptsDefaults properly', () => {
    const fake = { SurveyNotesBtnSize: 'large' };
    expect(AddThemeOptsDefaults(fake as ThemeOptionsConfigValues)).toEqual({
      ...DEFAULT_VALUES,
      ...fake,
    });
  });
});
