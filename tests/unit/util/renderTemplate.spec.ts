import { renderTemplate } from '~/util/renderTemplate';

describe('/util/renderTemplate', () => {
  const createStrToTemplate = (val) => `${val} foo bar`;

  it('should render first level object', () => {
    const data = { fizz: 'fuzz' };
    const tpl = createStrToTemplate('{{fizz}}');
    const result = createStrToTemplate(data.fizz);

    expect(renderTemplate(tpl, data)).toBe(result);
  });

  it('should render first level object with space', () => {
    const data = { fizz: 'fuzz' };
    const tpl = createStrToTemplate('{{ fizz }}');
    const result = createStrToTemplate(data.fizz);

    expect(renderTemplate(tpl, data)).toBe(result);
  });

  it('should render deep level object', () => {
    const data = { fizz: { fuzz: 'fizzfuzz' } };
    const tpl = createStrToTemplate('{{fizz.fuzz}}');
    const result = createStrToTemplate(data.fizz.fuzz);

    expect(renderTemplate(tpl, data)).toBe(result);
  });
});
