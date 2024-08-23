describe("Homepage", () => {
  before(() => {
    cy.createTestSeed();
  });

  after(() => {
    cy.deleteTestSeed();
  });

  beforeEach(() => {
    cy.visit("/");
  });

  it("It load correctly with all elements", () => {
    cy.get('[data-id="sign-in-button"]').should("be.visible");
    cy.get('[data-id="sign-in-button"]').should("contain", "Sign In");

    cy.get('[data-id="homepage-title"]').should("be.visible");
    cy.get('[data-id="homepage-title"]').should(
      "contain",
      "SHARE YOUR SEXUALITY"
    );

    cy.get('[data-id^="user-card-"]').should("have.length", 12);

    cy.get('[data-id="homepage-footer"]').should("be.visible");
  });

  it("It navigate to login when click on sign in", () => {
    cy.get('[data-id="sign-in-button"]').click();

    cy.url().should("include", "/en/login");
  });

  it("It navigate to login when click on see more", () => {
    cy.get('[data-id="see-more-users-btn"]').click();

    cy.url().should("include", "/en/login");
  });

  it("It navigate to user profile when clicking on it", () => {
    cy.get('[data-id="user-card-0"]').click();

    cy.url().should("match", /\/dashboard\/community\/[a-zA-Z0-9_-]+$/);
  });
});
