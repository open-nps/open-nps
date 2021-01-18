Cypress.Commands.add('createSetupByApi', (fixtureTarget: FixtureTarget) => {
  const createTarget = (target) =>
    cy.request({
      url: '/api/target',
      method: 'POST',
      body: target,
    });

  const createConfig = (config) =>
    cy.request({
      url: '/api/config',
      method: 'POST',
      body: config,
    });

  const createConfigsGetIds = (configs) => cy.all(configs.map(createConfig));

  const getConfigs = () =>
    cy
      .request({
        url: '/api/config',
        method: 'GET',
      })
      .then(({ body }) => body);

  return createConfigsGetIds(fixtureTarget.configs)
    .then(getConfigs)
    .then(({ configs }) => createTarget({ ...fixtureTarget, configs }))
    .then(({ body }) => ({ ...body, configs: fixtureTarget.configs }));
});

Cypress.Commands.add(
  'createSurveyByApi',
  (target: FixtureTarget, reviewer: FixtureReviewer) => {
    return cy
      .request({
        url: '/api/survey',
        method: 'POST',
        body: {
          reviewer: reviewer,
          targetName: target.name,
        },
      })
      .then(({ body }) => ({ ...body, target, reviewer }));
  }
);
