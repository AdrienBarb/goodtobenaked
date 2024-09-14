import { User } from "./User";

export interface Media {
  _id: string;
  user: User;
  mediaType: "image" | "video";
  convertedKey?: string;
  blurredKey?: string;
  posterKey?: string;
  imageUrl?: string;
  status: "created" | "ready" | "error";
  isArchived: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
