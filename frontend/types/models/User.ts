import { Gender } from "./genderModel";
import { Invoice } from "./Invoice";
import { Media } from "./Media";

interface Revenue {
  isBankTransferAutomatic: boolean;
  invoices: Invoice[];
}

interface Address {
  street?: string;
  zip?: string;
  city?: string;
  country?: string;
}

interface BankAccount {
  name?: string;
  iban?: string;
  address?: Address;
}

export interface User {
  _id: string;
  pseudo: string;
  email: string;
  password: string;
  gender?: Gender;
  profileImage: string;
  secondaryProfileImages: Media[];
  emailNotification: boolean;
  userType: "creator" | "member";
  description?: string;
  nationality?: string;
  breastSize?: "tiny" | "normal" | "big" | "huge";
  buttSize?: "small" | "normal" | "big" | "huge";
  bodyType?: "skinny" | "athletic" | "medium" | "curvy";
  hairColor?: "black" | "blonde" | "brunette" | "redhead";
  age?: number;
  verified: "unverified" | "rejected" | "pending" | "verified";
  emailVerified: boolean;
  isAccountVerified: boolean;
  country?: string;
  salesFee: number;
  revenue?: Revenue;
  bankAccount?: BankAccount;
  inappNotification: ("profile_viewed" | "message")[];
  lastLogin?: Date;
  referredBy?: User;
  notificationSubscribers: string[];
  profileViewers: string[];
  messageSenders: string[];
  nudeBuyers: string[];
  version: number;
  isAmbassador: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
