const resolveAndPassForward = (
  [head, ...tail]: Cypress.Chainable<any>[],
  results: any[] = []
): Cypress.Chainable<any> => {
  return head.then((v) => {
    const newValues = [...results, v];
    if (tail.length > 0) {
      return resolveAndPassForward(tail, newValues);
    }

    return newValues;
  });
};

Cypress.Commands.add('all', (chains) => {
  return resolveAndPassForward(chains);
});
