describe('Survey', () => {
  const createSurvey = (target) =>
    cy
      .fixture('reviewer')
      .then((reviewer) => cy.createSurveyByApi(target, reviewer));

  it('alo', () => {
    const fakeComment = 'Foo Bar Alow';

    const clickInRandomButton = () => {
      const idx = Math.floor(10 * Math.random());

      return cy.getBySel('SurveyNoteBtn').eq(idx).click();
    };

    const typeComment = (comment: string) => () =>
      cy.getBySel('SurveyComment').type(comment);

    const checkSurveyPageTypography = (value: string) => () =>
      cy.getBySel('SurveyPageTypography').should('have.text', value);

    const checkThanksPageTypography = (value: string) => () =>
      cy.getBySel('ThanksPageTypography').should('have.text', value);

    const clickInSubmit = () => cy.getBySel('SurveySubmit').click();

    cy.fixture('target')
      .then(cy.createSetupByApi)
      .then(createSurvey)
      .then((survey: TestSurvey) =>
        cy
          .visit(`/survey/${survey._id}`)
          .then(
            checkSurveyPageTypography(
              `${survey.reviewer.name} about ${survey.target.meta.name}`
            )
          )
          .then(clickInRandomButton)
          .then((btn) =>
            cy.wrap(btn).should('have.class', 'MuiButton-containedPrimary')
          )
          .then(typeComment(fakeComment))
          .then((comment) =>
            cy.wrap(comment.find('textarea')).should('have.text', fakeComment)
          )
          .then(clickInSubmit)
          .wait(1000)
          .then(checkThanksPageTypography(`Thanks ${survey.reviewer.name}`))
      );
  });
});
