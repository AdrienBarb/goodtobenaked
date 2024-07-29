import { Media } from "./Media";
import { User } from "./User";

interface PriceDetails {
  fiatPrice: number;
  creditPrice: number;
  currency: "USD" | "EUR";
}

export interface Nude {
  _id: string;
  user: User;
  description?: string;
  priceDetails: PriceDetails;
  isArchived: boolean;
  isFree: boolean;
  paidMembers: string[];
  medias: Media[];
  visibility: "public" | "private";
  createdAt?: Date;
  updatedAt?: Date;
}
