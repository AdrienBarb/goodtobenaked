import { Creator } from "./Creator";
import { Media } from "./Media";
import { User } from "./User";

interface PriceDetails {
  basePrice: number;
  commission: number;
  basePriceWithCommission: number;
  creditPrice: number;
  currency: "USD" | "EUR";
}

export interface Nude {
  _id: string;
  user: User;
  description?: string;
  priceDetails: PriceDetails;
  totalPrice: number;
  isArchived: boolean;
  isFree: boolean;
  paidMembers: string[];
  medias: Media[];
  visibility: "public" | "private";
  createdAt?: Date;
  updatedAt?: Date;
}
