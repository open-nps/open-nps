let hash = '';

Cypress.Commands.add('loginAdmin', () =>
  cy
    .request({
      url: '/api/token',
      method: 'POST',
      body: { email: 'admin@open.nps', password: 'opennps123' },
    })
    .then(({ body }) => {
      hash = body.hash;
      return body;
    })
);

Cypress.Commands.add('createSetupByApi', (fixtureTarget: FixtureTarget) => {
  const createTarget = (target) =>
    cy.request({
      url: '/api/target',
      method: 'POST',
      body: target,
      headers: {
        authorization: hash,
      },
    });

  const createConfig = (config) =>
    cy.request({
      url: '/api/config',
      method: 'POST',
      body: config,
      headers: {
        authorization: hash,
      },
    });

  const createConfigsGetIds = (configs) => cy.all(configs.map(createConfig));

  const getConfigs = () =>
    cy
      .request({
        url: '/api/config',
        method: 'GET',
        headers: {
          authorization: hash,
        },
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
        headers: {
          authorization: hash,
        },
      })
      .then(({ body }) => ({ ...body, target, reviewer }));
  }
);
