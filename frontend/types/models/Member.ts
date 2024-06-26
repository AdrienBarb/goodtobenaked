import { Address } from "./Address";

export interface Member {
  _id: string;
  firstname?: string;
  lastname?: string;
  pseudo: string;
  email: string;
  password: string;
  verified?: boolean;
  emailNotification?: boolean;
  address: Address;
  profilPicture?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  profileUrl: string;
  emailVerified: boolean;
  inappNotification: "message" | "newProduct";
}
