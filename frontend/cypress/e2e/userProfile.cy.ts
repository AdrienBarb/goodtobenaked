describe("Profile Access Test", () => {
  beforeEach(() => {
    cy.loginAs("verifiedCreator");
  });

  it("Devrait permettre à un utilisateur connecté de voir son profil", () => {
    cy.fixture("users").then((users) => {
      const userId = users.verifiedCreator._id;

      // Naviguer vers l'URL du profil de l'utilisateur
      cy.visit(`/en/dashboard/community/${userId}`);

      // Vérifier que l'URL est correcte
      cy.url().should("include", `/community/${userId}`);
    });
  });
});
