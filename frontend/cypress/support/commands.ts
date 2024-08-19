/// <reference types="cypress" />

import { v4 as uuidv4 } from "uuid";
import { encode } from "next-auth/jwt";
import type { JWT } from "next-auth/jwt";

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to log in as a specific user type
       * @param userType - The type of user to log in as (e.g., 'member', 'verifiedCreator')
       * @example cy.loginAs('member')
       */
      loginAs(userType: keyof UsersFixture): Chainable<void>;
      createTestSeed(): Chainable<void>;
      deleteTestSeed(): Chainable<void>;
    }
  }
}

interface User {
  email: string;
  password: string;
  [key: string]: any;
}

interface UsersFixture {
  member: User;
  verifiedCreator: User;
  unverifiedCreator: User;
  [key: string]: User;
}

Cypress.Commands.add("loginAs", (userType: keyof UsersFixture) => {
  cy.fixture("users").then((users: UsersFixture) => {
    const user = users[userType];

    cy.request("POST", Cypress.env("LOGIN_API_URL"), {
      email: user.email,
      password: user.password,
    }).then((response) => {
      const userData = response.body;

      const dateTimeNow = Math.floor(Date.now() / 1000);
      const expiry = dateTimeNow + 30 * 24 * 60 * 60;
      const cookieValue: JWT = {
        id: userData._id,
        pseudo: userData.pseudo,
        email: userData.email,
        isAccountVerified: userData.isAccountVerified,
        isAmbassador: userData.isAmbassador,
        salesFee: userData.salesFee,
        userType: userData.userType,
        accessToken: userData.accessToken,
        iat: dateTimeNow,
        exp: expiry,
        jti: uuidv4(),
      };

      cy.wrap(null, { log: false }).then(() => {
        return new Cypress.Promise(async (resolve, reject) => {
          try {
            const encryptedCookieValue = await encode({
              token: cookieValue,
              secret: Cypress.env("NEXTAUTH_SECRET"),
            });

            cy.setCookie("next-auth.session-token", encryptedCookieValue, {
              httpOnly: true,
              secure: true,
              sameSite: "lax",
              path: "/",
              expiry: expiry,
            });

            resolve();
          } catch (err) {
            console.error(err);
            reject(err);
          }
        });
      });
    });
  });
});

Cypress.Commands.add("createTestSeed", () => {
  cy.request("POST", `${Cypress.env("API_URL")}/tests/create-seed`)
    .its("status")
    .should("eq", 200);
});

Cypress.Commands.add("deleteTestSeed", () => {
  cy.request("POST", `${Cypress.env("API_URL")}/tests/delete-seed`)
    .its("status")
    .should("eq", 200);
});

export {};
