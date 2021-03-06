import get from 'lodash.get';

export const renderTemplate = (phrase: string, data: AnyObject): string =>
  phrase.replace(/\{\{(.*?)\}\}/g, (value: string) =>
    get(data, value.replace(/\{|\}/g, '').trim())
  );
