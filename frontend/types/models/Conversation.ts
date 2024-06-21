import { Message } from "./Message";
import { User } from "./User";

export interface Conversation {
  _id: string;
  participants: User[];
  participantDetails: User[];
  messages: Message[];
  blockedUsers: string[];
  createdAt?: Date;
  updatedAt?: Date;
  unreadMessage: boolean;
}
