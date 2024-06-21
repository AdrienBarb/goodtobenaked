import { User } from "./User";

export interface Media {
  _id: string;
  user: User;
  mediaType: "image" | "video";
  durationInMs: string;
  fileName: string;
  originalKey: string;
  convertedKey: string;
  blurredKey: string;
  posterKey: string;
  status: "created" | "ready" | "error";
  isArchived: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
