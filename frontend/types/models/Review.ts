import { Member } from "./Member";

export interface Review {
  _id: string;
  rate: number;
  author: Member;
  comment?: string;
  acceptedAt: string;
  createdAt: string;
}
