import userAuthService from "@/features/user-auth/userAuthService";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      id: "credentials",
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const user = await userAuthService.login({
          email: credentials?.email,
          password: credentials?.password,
        });

        if (user) {
          return user;
        } else {
          throw new Error("Authentication failed");
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt: async ({ token, trigger, user, session }) => {
      if (user) {
        token.id = user._id;
        token.pseudo = user.pseudo;
        token.email = user.email;
        token.isAccountVerified = user.isAccountVerified;
        token.isAmbassador = user.isAmbassador;
        token.salesFee = user.salesFee;
        token.userType = user.userType;
        token.accessToken = user.accessToken;
      }

      if (trigger === "update" && session.user) {
        token = session.user;
      }

      return token;
    },
    session: async ({ session, token }) => {
      if (token) {
        session.user.id = token.id as string;
        session.user.pseudo = token.pseudo as string;
        session.user.email = token.email as string;
        session.user.isAccountVerified = token.isAccountVerified as boolean;
        session.user.isAmbassador = token.isAmbassador as boolean;
        session.user.salesFee = token.salesFee as number;
        session.user.userType = token.userType as string;
        session.user.accessToken = token.accessToken as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
