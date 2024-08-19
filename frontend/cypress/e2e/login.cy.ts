describe("Login", () => {
  before(() => {
    cy.createTestSeed();
  });

  after(() => {
    cy.wait(5000);
    cy.deleteTestSeed();
  });

  beforeEach(() => {
    cy.visit("/en/login");
  });

  it("A member can login", () => {
    cy.get('input[name="email"]').type("member@gmail.com");

    cy.get('input[name="password"]').type("jesaispas");

    cy.get('button[type="submit"]').click();

    cy.url().should("include", "/dashboard/feed");
  });

  it("A creator can login", () => {
    cy.get('input[name="email"]').type("verifiedcreator@gmail.com");

    cy.get('input[name="password"]').type("jesaispas");

    cy.get('button[type="submit"]').click();

    cy.url().should("include", "/dashboard/feed");
  });
});
