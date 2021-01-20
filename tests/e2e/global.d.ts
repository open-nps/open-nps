interface FixtureTarget {
  name: string;
  meta: any;
  configs: {
    key: string;
    alias: string;
    values: any;
  }[];
}

interface FixtureReviewer {
  id: string;
  name: string;
}

interface FixtureReviewerWithID extends FixtureReviewer {
  _id: string;
}

interface FixtureTargetWithID extends FixtureTarget {
  _id: string;
}

interface TestSurvey {
  _id: string;
  reviewer: FixtureReviewer;
  target: FixtureTargetWithID;
}

declare namespace Cypress {
  interface Chainable {
    getBySel(
      dataCyAttribute: string,
      args?: Partial<
        Cypress.Loggable &
          Cypress.Timeoutable &
          Cypress.Withinable &
          Cypress.Shadow
      >
    ): Chainable<JQuery<HTMLElement>>;
    all(args: Chainable<any>[]): Chainable<any>;
    createSetupByApi(target: FixtureTarget): Chainable<FixtureTargetWithID>;
    createSurveyByApi(
      target: FixtureTarget,
      reviewer: FixtureReviewer
    ): Chainable<TestSurvey>;
    loginAdmin(): Chainable<{ hash: string }>;
  }
}
