import "next-auth";

declare module "next-auth" {
  interface User {
    _id?: string;
    email?: string;
    pseudo?: string;
    isAccountVerified?: boolean;
    creditAmount?: number;
    isAmbassador?: boolean;
    salesFee?: number;
    accessToken?: string;
    userType?: string;
  }

  interface Session {
    user: User;
  }

  interface JWT {
    id?: string;
    pseudo?: string;
    email?: string;
    creditAmount?: number;
    isAmbassador?: boolean;
    salesFee?: number;
    accessToken?: string;
    userType?: string;
  }
}
