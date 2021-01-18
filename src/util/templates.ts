export const DEFAULT_VALUES = {
  CoreQuestionPhrase:
    'How likely is it that you would recommend {{ target.name }} to a friend or colleague?',
  ThanksPhrase: 'Thanks {{reviewer.name}} for your feedback!',
  SendButtonMessage: 'Send',
};

export const AddDefaultTemplates = (
  templates: Partial<TemplatesConfigValues>
): TemplatesConfigValues =>
  ({
    ...DEFAULT_VALUES,
    ...templates,
  } as TemplatesConfigValues);
