import { User } from "./User";

export interface Notification {
  _id: string;
  fromUser: User;
  targetUser: User;
  type: "profile_viewed";
  read: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
