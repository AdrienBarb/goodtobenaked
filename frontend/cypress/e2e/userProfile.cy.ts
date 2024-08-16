describe("Users profile", () => {
  describe("Not logged", () => {
    it("It can see a creator profile", () => {
      cy.fixture("users").then((users) => {
        const userId = users.verifiedCreator._id;

        cy.visit(`/en/dashboard/community/${userId}`);

        //Check url
        cy.url().should("include", `/community/${userId}`);

        //Not show menu
        cy.get('[data-id="mobile-burger-menu"]').should("not.exist");

        //Not show add menu
        cy.get('[data-id="user-add-menu"]').should("not.exist");

        //Not show credit amount
        cy.get('[data-id="navigation-credit-amount"]').should("not.exist");

        //Show top button
        cy.get('[data-id="edit-profile-btn"]').should("not.exist");
        cy.get('[data-id="share-profile-btn"]').should("not.exist");

        //Show pseudo
        cy.get('[data-id="user-pseudo"]').should("be.visible");
        cy.get('[data-id="user-pseudo"]').should("contain", "verifiedCreator");

        //Don't show profile buttons
        cy.get('[data-id="tips-btn"]').should("be.visible");
        cy.get('[data-id="profile-message-btn"]').should("be.visible");
        cy.get('[data-id="profile-follow-btn"]').should("be.visible");

        //Show secondary images
        cy.get('[data-id^="user-secondary-images-"]').should("have.length", 2);

        //Show nudes
        cy.get('[data-id^="user-nude-"]').should("have.length", 3);

        //Not show user card menu
        cy.get('[data-id="user-card-menu-list"]').should("not.exist");
      });
    });
  });

  describe("Logged", () => {
    describe("Verified Creator", () => {
      beforeEach(() => {
        cy.loginAs("verifiedCreator");
      });

      it("It can see his profile when logged", () => {
        cy.fixture("users").then((users) => {
          const userId = users.verifiedCreator._id;

          cy.visit(`/en/dashboard/community/${userId}`);

          //Check url
          cy.url().should("include", `/community/${userId}`);

          //Show menu
          cy.get('[data-id="mobile-burger-menu"]').should("be.visible");

          //Show add menu
          cy.get('[data-id="user-add-menu"]').should("be.visible");

          //Show credit amount
          cy.get('[data-id="navigation-credit-amount"]').should("be.visible");

          //Show top button
          cy.get('[data-id="edit-profile-btn"]').should("be.visible");
          cy.get('[data-id="share-profile-btn"]').should("be.visible");

          //Not show uncompleted profile banenr
          cy.get('[data-id="uncompleted-profile-banner"]').should("not.exist");

          //Show pseudo
          cy.get('[data-id="user-pseudo"]').should("be.visible");
          cy.get('[data-id="user-pseudo"]').should(
            "contain",
            "verifiedCreator"
          );

          //Don't show profile buttons
          cy.get('[data-id="tips-btn"]').should("not.exist");
          cy.get('[data-id="profile-message-btn"]').should("not.exist");
          cy.get('[data-id="profile-follow-btn"]').should("not.exist");

          //Show secondary images
          cy.get('[data-id^="user-secondary-images-"]').should(
            "have.length",
            2
          );

          //Show nudes
          cy.get('[data-id^="user-nude-"]').should("have.length", 3);

          //Show user card menu
          cy.get('[data-id="user-card-menu-list"]').should("be.visible");
        });
      });

      it("It can see the profile of a unverified creator", () => {
        cy.fixture("users").then((users) => {
          const userId = users.unverifiedCreator._id;

          cy.visit(`/en/dashboard/community/${userId}`);

          //Check url
          cy.url().should("include", `/community/${userId}`);

          //Show menu
          cy.get('[data-id="mobile-burger-menu"]').should("be.visible");

          //Show add menu
          cy.get('[data-id="user-add-menu"]').should("be.visible");

          //Show credit amount
          cy.get('[data-id="navigation-credit-amount"]').should("be.visible");

          //Show top button
          cy.get('[data-id="edit-profile-btn"]').should("not.exist");
          cy.get('[data-id="share-profile-btn"]').should("be.visible");

          //Not show uncompleted profile banenr
          cy.get('[data-id="uncompleted-profile-banner"]').should("not.exist");

          //Show pseudo
          cy.get('[data-id="user-pseudo"]').should("be.visible");
          cy.get('[data-id="user-pseudo"]').should(
            "contain",
            "verifiedCreator"
          );

          //Don't show profile buttons
          cy.get('[data-id="tips-btn"]').should("not.exist");
          cy.get('[data-id="profile-message-btn"]').should("be.visible");
          cy.get('[data-id="profile-follow-btn"]').should("be.visible");

          //Show secondary images
          cy.get('[data-id^="user-secondary-images-"]').should(
            "have.length",
            2
          );

          //Show nudes
          cy.get('[data-id^="user-nude-"]').should("not.exist");

          //Show user card menu
          cy.get('[data-id="user-card-menu-list"]').should("not.exist");
        });
      });

      it("It can see the profile of a member", () => {
        cy.fixture("users").then((users) => {
          const userId = users.member._id;

          cy.visit(`/en/dashboard/community/${userId}`);

          //Check url
          cy.url().should("include", `/community/${userId}`);

          //Show menu
          cy.get('[data-id="mobile-burger-menu"]').should("be.visible");

          //Show add menu
          cy.get('[data-id="user-add-menu"]').should("be.visible");

          //Show credit amount
          cy.get('[data-id="navigation-credit-amount"]').should("be.visible");

          //Show top button
          cy.get('[data-id="edit-profile-btn"]').should("not.exist");
          cy.get('[data-id="share-profile-btn"]').should("be.visible");

          //Show uncompleted profile banenr
          cy.get('[data-id="uncompleted-profile-banner"]').should("not.exist");

          //Show pseudo
          cy.get('[data-id="user-pseudo"]').should("be.visible");
          cy.get('[data-id="user-pseudo"]').should("contain", "member");

          //Don't show profile buttons
          cy.get('[data-id="tips-btn"]').should("not.exist");
          cy.get('[data-id="profile-message-btn"]').should("be.visible");
          cy.get('[data-id="profile-follow-btn"]').should("not.exist");

          //Show secondary images
          cy.get('[data-id^="user-secondary-images-"]').should("not.exist");

          //Show nudes
          cy.get('[data-id^="user-nude-"]').should("not.exist");

          //Show user card menu
          cy.get('[data-id="user-card-menu-list"]').should("not.exist");
        });
      });
    });

    describe("Unverified Creator", () => {
      beforeEach(() => {
        cy.loginAs("unverifiedCreator");
      });

      it("It can see his profile when logged", () => {
        cy.fixture("users").then((users) => {
          const userId = users.unverifiedCreator._id;

          cy.visit(`/en/dashboard/community/${userId}`);

          //Check url
          cy.url().should("include", `/community/${userId}`);

          //Show menu
          cy.get('[data-id="mobile-burger-menu"]').should("be.visible");

          //Show add menu
          cy.get('[data-id="user-add-menu"]').should("be.visible");

          //Show credit amount
          cy.get('[data-id="navigation-credit-amount"]').should("be.visible");

          //Show top button
          cy.get('[data-id="edit-profile-btn"]').should("be.visible");
          cy.get('[data-id="share-profile-btn"]').should("be.visible");

          //Show uncompleted profile banenr
          cy.get('[data-id="uncompleted-profile-banner"]').should("be.visible");

          //Show pseudo
          cy.get('[data-id="user-pseudo"]').should("be.visible");
          cy.get('[data-id="user-pseudo"]').should(
            "contain",
            "unverifiedCreator"
          );

          //Don't show profile buttons
          cy.get('[data-id="tips-btn"]').should("not.exist");
          cy.get('[data-id="profile-message-btn"]').should("not.exist");
          cy.get('[data-id="profile-follow-btn"]').should("not.exist");

          //Show secondary images
          cy.get('[data-id^="user-secondary-images-"]').should(
            "have.length",
            2
          );

          //Show nudes
          cy.get('[data-id^="user-nude-"]').should("have.length", 3);

          //Show user card menu
          cy.get('[data-id="user-card-menu-list"]').should("be.visible");
        });
      });

      it("It can see the profile of a verified creator", () => {
        cy.fixture("users").then((users) => {
          const userId = users.verifiedCreator._id;

          cy.visit(`/en/dashboard/community/${userId}`);

          //Check url
          cy.url().should("include", `/community/${userId}`);

          //Show menu
          cy.get('[data-id="mobile-burger-menu"]').should("be.visible");

          //Show add menu
          cy.get('[data-id="user-add-menu"]').should("be.visible");

          //Show credit amount
          cy.get('[data-id="navigation-credit-amount"]').should("be.visible");

          //Show top button
          cy.get('[data-id="edit-profile-btn"]').should("not.exist");
          cy.get('[data-id="share-profile-btn"]').should("be.visible");

          //Show uncompleted profile banenr
          cy.get('[data-id="uncompleted-profile-banner"]').should("not.exist");

          //Show pseudo
          cy.get('[data-id="user-pseudo"]').should("be.visible");
          cy.get('[data-id="user-pseudo"]').should(
            "contain",
            "verifiedCreator"
          );

          //Don't show profile buttons
          cy.get('[data-id="tips-btn"]').should("be.visible");
          cy.get('[data-id="profile-message-btn"]').should("be.visible");
          cy.get('[data-id="profile-follow-btn"]').should("be.visible");

          //Show secondary images
          cy.get('[data-id^="user-secondary-images-"]').should(
            "have.length",
            2
          );

          //Show nudes
          cy.get('[data-id^="user-nude-"]').should("have.length", 3);

          //Show user card menu
          cy.get('[data-id="user-card-menu-list"]').should("not.exist");
        });
      });

      it("It can see the profile of a member", () => {
        cy.fixture("users").then((users) => {
          const userId = users.member._id;

          cy.visit(`/en/dashboard/community/${userId}`);

          //Check url
          cy.url().should("include", `/community/${userId}`);

          //Show menu
          cy.get('[data-id="mobile-burger-menu"]').should("be.visible");

          //Show add menu
          cy.get('[data-id="user-add-menu"]').should("be.visible");

          //Show credit amount
          cy.get('[data-id="navigation-credit-amount"]').should("be.visible");

          //Show top button
          cy.get('[data-id="edit-profile-btn"]').should("not.exist");
          cy.get('[data-id="share-profile-btn"]').should("be.visible");

          //Show uncompleted profile banenr
          cy.get('[data-id="uncompleted-profile-banner"]').should("not.exist");

          //Show pseudo
          cy.get('[data-id="user-pseudo"]').should("be.visible");
          cy.get('[data-id="user-pseudo"]').should("contain", "member");

          //Don't show profile buttons
          cy.get('[data-id="tips-btn"]').should("not.exist");
          cy.get('[data-id="profile-message-btn"]').should("be.visible");
          cy.get('[data-id="profile-follow-btn"]').should("not.exist");

          //Show secondary images
          cy.get('[data-id^="user-secondary-images-"]').should("not.exist");

          //Show nudes
          cy.get('[data-id^="user-nude-"]').should("not.exist");

          //Show user card menu
          cy.get('[data-id="user-card-menu-list"]').should("not.exist");
        });
      });
    });

    describe("Member", () => {
      beforeEach(() => {
        cy.loginAs("member");
      });

      it("It can see his profile when logged", () => {
        cy.fixture("users").then((users) => {
          const userId = users.member._id;

          cy.visit(`/en/dashboard/community/${userId}`);

          //Check url
          cy.url().should("include", `/community/${userId}`);

          //Show menu
          cy.get('[data-id="mobile-burger-menu"]').should("be.visible");

          //Not show add menu
          cy.get('[data-id="user-add-menu"]').should("not.exist");

          //Show credit amount
          cy.get('[data-id="navigation-credit-amount"]').should("be.visible");

          //Show top button
          cy.get('[data-id="edit-profile-btn"]').should("be.visible");
          cy.get('[data-id="share-profile-btn"]').should("be.visible");

          //Show pseudo
          cy.get('[data-id="user-pseudo"]').should("be.visible");
          cy.get('[data-id="user-pseudo"]').should("contain", "member");

          //Don't show profile buttons
          cy.get('[data-id="tips-btn"]').should("not.exist");
          cy.get('[data-id="profile-message-btn"]').should("not.exist");
          cy.get('[data-id="profile-follow-btn"]').should("not.exist");
        });
      });

      it("It can see the profile of a verified creator", () => {
        cy.fixture("users").then((users) => {
          const userId = users.verifiedCreator._id;

          cy.visit(`/en/dashboard/community/${userId}`);

          //Check url
          cy.url().should("include", `/community/${userId}`);

          //Show menu
          cy.get('[data-id="mobile-burger-menu"]').should("be.visible");

          //Show add menu
          cy.get('[data-id="user-add-menu"]').should("not.exist");

          //Show credit amount
          cy.get('[data-id="navigation-credit-amount"]').should("be.visible");

          //Show top button
          cy.get('[data-id="edit-profile-btn"]').should("not.exist");
          cy.get('[data-id="share-profile-btn"]').should("be.visible");

          //Show uncompleted profile banenr
          cy.get('[data-id="uncompleted-profile-banner"]').should("not.exist");

          //Show pseudo
          cy.get('[data-id="user-pseudo"]').should("be.visible");
          cy.get('[data-id="user-pseudo"]').should(
            "contain",
            "verifiedCreator"
          );

          //Don't show profile buttons
          cy.get('[data-id="tips-btn"]').should("be.visible");
          cy.get('[data-id="profile-message-btn"]').should("be.visible");
          cy.get('[data-id="profile-follow-btn"]').should("be.visible");

          //Show secondary images
          cy.get('[data-id^="user-secondary-images-"]').should(
            "have.length",
            2
          );

          //Show nudes
          cy.get('[data-id^="user-nude-"]').should("have.length", 3);

          //Show user card menu
          cy.get('[data-id="user-card-menu-list"]').should("not.exist");
        });
      });

      it("It can see the profile of a unverified creator", () => {
        cy.fixture("users").then((users) => {
          const userId = users.unverifiedCreator._id;

          cy.visit(`/en/dashboard/community/${userId}`);

          //Check url
          cy.url().should("include", `/community/${userId}`);

          //Show menu
          cy.get('[data-id="mobile-burger-menu"]').should("be.visible");

          //Show add menu
          cy.get('[data-id="user-add-menu"]').should("not.exist");

          //Show credit amount
          cy.get('[data-id="navigation-credit-amount"]').should("be.visible");

          //Show top button
          cy.get('[data-id="edit-profile-btn"]').should("not.exist");
          cy.get('[data-id="share-profile-btn"]').should("be.visible");

          //Not show uncompleted profile banenr
          cy.get('[data-id="uncompleted-profile-banner"]').should("not.exist");

          //Show pseudo
          cy.get('[data-id="user-pseudo"]').should("be.visible");
          cy.get('[data-id="user-pseudo"]').should(
            "contain",
            "verifiedCreator"
          );

          //Don't show profile buttons
          cy.get('[data-id="tips-btn"]').should("not.exist");
          cy.get('[data-id="profile-message-btn"]').should("be.visible");
          cy.get('[data-id="profile-follow-btn"]').should("be.visible");

          //Show secondary images
          cy.get('[data-id^="user-secondary-images-"]').should(
            "have.length",
            2
          );

          //Show nudes
          cy.get('[data-id^="user-nude-"]').should("not.exist");

          //Show user card menu
          cy.get('[data-id="user-card-menu-list"]').should("not.exist");
        });
      });
    });
  });
});
