import { defineConfig } from "cypress";
import dotenv from "dotenv";

dotenv.config({ path: ".env.development" });

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    env: {
      LOGIN_API_URL: "http://localhost:3001/api/users/login",
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    },
  },
});
