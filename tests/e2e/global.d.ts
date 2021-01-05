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
  uniqueIdentifier: string;
  meta: any;
}

interface FixtureReviewerWithID extends FixtureReviewer {
  _id: string;
}

interface FixtureTargetWithID extends FixtureTarget {
  _id: string;
}

interface TestResearch {
  _id: string;
  reviewer: FixtureReviewerWithID;
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
    createResearchByApi(
      target: FixtureTarget,
      reviewer: FixtureReviewer
    ): Chainable<TestResearch>;
  }
}
