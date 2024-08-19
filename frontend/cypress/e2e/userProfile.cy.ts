describe("Users profile", () => {
  before(() => {
    cy.createTestSeed();
  });

  after(() => {
    cy.deleteTestSeed();
  });

  describe("Not logged", () => {
    beforeEach(() => {
      cy.fixture("users").then((users) => {
        const userId = users.verifiedCreator._id;

        cy.visit(`/en/dashboard/community/${userId}`);

        //Check url
        cy.url().should("include", `/community/${userId}`);
      });
    });

    it("It can see a creator profile", () => {
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

    it("It navigate to sign in when click on tips button", () => {
      cy.get('[data-id="tips-btn"]').click();
      cy.url().should("include", "/en/login");
    });

    it("It navigate to sign in when click on message button", () => {
      cy.get('[data-id="profile-message-btn"]').click();
      cy.url().should("include", "/en/login");
    });

    it("It navigate to sign in when click on follow button", () => {
      cy.get('[data-id="profile-follow-btn"]').click();
      cy.url().should("include", "/en/login");
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

      it("It can create a conversation with a unverified creator", () => {
        cy.fixture("users").then((users) => {
          const userId = users.unverifiedCreator._id;

          cy.visit(`/en/dashboard/community/${userId}`);

          cy.get('[data-id="profile-message-btn"]').click();
          cy.url().should(
            "match",
            /\/dashboard\/account\/messages\/[a-zA-Z0-9_-]+$/
          );
        });
      });

      it("It can follow a unverified creator", () => {
        cy.fixture("users").then((users) => {
          const userId = users.unverifiedCreator._id;

          cy.visit(`/en/dashboard/community/${userId}`);

          cy.get('[data-id="profile-follow-btn"]')
            .should("have.css", "background-color", "rgb(255, 240, 235)")
            .click();

          cy.get('[data-id="profile-follow-btn"]').should(
            "have.css",
            "background-color",
            "rgb(206, 202, 255)"
          );

          //clean
          cy.get('[data-id="profile-follow-btn"]').click();
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

      it("It can create a conversation with a member", () => {
        cy.fixture("users").then((users) => {
          const userId = users.member._id;

          cy.visit(`/en/dashboard/community/${userId}`);

          cy.get('[data-id="profile-message-btn"]').click();
          cy.url().should(
            "match",
            /\/dashboard\/account\/messages\/[a-zA-Z0-9_-]+$/
          );
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

      it("It can create a conversation with a verified creator", () => {
        cy.fixture("users").then((users) => {
          const userId = users.verifiedCreator._id;

          cy.visit(`/en/dashboard/community/${userId}`);

          cy.get('[data-id="profile-message-btn"]').click();
          cy.url().should(
            "match",
            /\/dashboard\/account\/messages\/[a-zA-Z0-9_-]+$/
          );
        });
      });

      it("It can follow a verified creator", () => {
        cy.fixture("users").then((users) => {
          const userId = users.verifiedCreator._id;

          cy.visit(`/en/dashboard/community/${userId}`);

          cy.get('[data-id="profile-follow-btn"]')
            .should("have.css", "background-color", "rgb(255, 240, 235)")
            .click();

          cy.get('[data-id="profile-follow-btn"]').should(
            "have.css",
            "background-color",
            "rgb(206, 202, 255)"
          );

          //clean
          cy.get('[data-id="profile-follow-btn"]').click();
        });
      });

      it("It can open tips modal", () => {
        cy.fixture("users").then((users) => {
          const userId = users.verifiedCreator._id;

          cy.visit(`/en/dashboard/community/${userId}`);

          cy.get('[data-id="tips-modal"]').should("not.exist");

          cy.get('[data-id="tips-btn"]').click();

          cy.get('[data-id="tips-modal"]').should("be.visible");
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

      it("It can create a conversation with a member", () => {
        cy.fixture("users").then((users) => {
          const userId = users.member._id;

          cy.visit(`/en/dashboard/community/${userId}`);

          cy.get('[data-id="profile-message-btn"]').click();
          cy.url().should(
            "match",
            /\/dashboard\/account\/messages\/[a-zA-Z0-9_-]+$/
          );
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

      it("It can create a conversation with a verified creator", () => {
        cy.fixture("users").then((users) => {
          const userId = users.verifiedCreator._id;

          cy.visit(`/en/dashboard/community/${userId}`);

          cy.get('[data-id="profile-message-btn"]').click();
          cy.url().should(
            "match",
            /\/dashboard\/account\/messages\/[a-zA-Z0-9_-]+$/
          );
        });
      });

      it("It can follow a verified creator", () => {
        cy.fixture("users").then((users) => {
          const userId = users.verifiedCreator._id;

          cy.visit(`/en/dashboard/community/${userId}`);

          cy.get('[data-id="profile-follow-btn"]')
            .should("have.css", "background-color", "rgb(255, 240, 235)")
            .click();

          cy.get('[data-id="profile-follow-btn"]').should(
            "have.css",
            "background-color",
            "rgb(206, 202, 255)"
          );

          //clean
          cy.get('[data-id="profile-follow-btn"]').click();
        });
      });

      it("It can open tips modal", () => {
        cy.fixture("users").then((users) => {
          const userId = users.verifiedCreator._id;

          cy.visit(`/en/dashboard/community/${userId}`);

          cy.get('[data-id="tips-modal"]').should("not.exist");

          cy.get('[data-id="tips-btn"]').click();

          cy.get('[data-id="tips-modal"]').should("be.visible");
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

      it("It can create a conversation with a verified creator", () => {
        cy.fixture("users").then((users) => {
          const userId = users.verifiedCreator._id;

          cy.visit(`/en/dashboard/community/${userId}`);

          cy.get('[data-id="profile-message-btn"]').click();
          cy.url().should(
            "match",
            /\/dashboard\/account\/messages\/[a-zA-Z0-9_-]+$/
          );
        });
      });

      it("It can follow a verified creator", () => {
        cy.fixture("users").then((users) => {
          const userId = users.verifiedCreator._id;

          cy.visit(`/en/dashboard/community/${userId}`);

          cy.get('[data-id="profile-follow-btn"]')
            .should("have.css", "background-color", "rgb(255, 240, 235)")
            .click();

          cy.get('[data-id="profile-follow-btn"]').should(
            "have.css",
            "background-color",
            "rgb(206, 202, 255)"
          );

          //clean
          cy.get('[data-id="profile-follow-btn"]').click();
        });
      });
    });
  });
});
