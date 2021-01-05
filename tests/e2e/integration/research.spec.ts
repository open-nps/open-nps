describe('Research', () => {
  const createResearch = (target) =>
    cy
      .fixture('reviewer')
      .then((reviewer) => cy.createResearchByApi(target, reviewer));

  it('alo', () => {
    const fakeComment = 'Foo Bar Alow';

    const clickInRandomButton = () => {
      const idx = Math.floor(10 * Math.random());

      return cy.getBySel('ResearchNoteBtn').eq(idx).click();
    };

    const typeComment = (comment: string) => () =>
      cy.getBySel('ResearchComment').type(comment);

    const checkResearchPageTypography = (value: string) => () =>
      cy.getBySel('ResearchPageTypography').should('have.text', value);

    const checkThanksPageTypography = (value: string) => () =>
      cy.getBySel('ThanksPageTypography').should('have.text', value);

    const clickInSubmit = () => cy.getBySel('ResearchSubmit').click();

    cy.fixture('target')
      .then(cy.createSetupByApi)
      .then(createResearch)
      .then((research: TestResearch) =>
        cy
          .visit(`/research/${research._id}`)
          .then(
            checkResearchPageTypography(
              `${research.reviewer.meta.name} about ${research.target.meta.name}`
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
          .then(
            checkThanksPageTypography(`Thanks ${research.reviewer.meta.name}`)
          )
      );
  });
});
