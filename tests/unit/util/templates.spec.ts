import { DEFAULT_VALUES, AddDefaultTemplates } from '~/util/templates';

describe('/util/templates', () => {
  it('should exec AddDefaultTemplates properly', () => {
    const fake = { CoreQuestionPhrase: 'FooBar' };
    expect(AddDefaultTemplates(fake as TemplatesConfigValues)).toEqual({
      ...DEFAULT_VALUES,
      ...fake,
    });
  });
});
