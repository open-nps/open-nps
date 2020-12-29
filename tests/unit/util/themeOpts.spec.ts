import { DEFAULT_VALUES, AddThemeOptsDefaults } from '~/util/themeOpts';

describe('/util/themeOpts', () => {
  it('should exec AddThemeOptsDefaults properly', () => {
    const fake = { ResearchNotesBtnSize: 'large' };
    expect(AddThemeOptsDefaults(fake as ThemeOptionsConfigValues)).toEqual({
      ...DEFAULT_VALUES,
      ...fake,
    });
  });
});
