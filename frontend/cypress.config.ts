import { defineConfig } from "cypress";
import dotenv from "dotenv";

dotenv.config({ path: ".env.development" });

const environment = process.env.CYPRESS_ENV || "development";

console.log("environmentenvironmentenvironment ", environment);

export default defineConfig({
  e2e: {
    baseUrl:
      environment === "staging"
        ? "https://staging.kyynk.com"
        : "http://localhost:3000",
    setupNodeEvents(on, config) {},
    env: {
      LOGIN_API_URL:
        environment === "staging"
          ? "https://api-staging.kyynk.com/api/users/login"
          : "http://localhost:3001/api/users/login",
      API_URL:
        environment === "staging"
          ? "https://api-staging.kyynk.com/api"
          : "http://localhost:3001/api",
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    },
  },
});
