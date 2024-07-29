import { User } from "./User";

export interface Invoice {
  _id: string;
  title: string;
  path: string;
  type?: "fee" | "creatorGain";
  paid: boolean;
  creator: User;
  toBePaid: number;
  createdAt?: Date;
  updatedAt?: Date;
}
