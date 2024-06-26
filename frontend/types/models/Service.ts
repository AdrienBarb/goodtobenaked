import { Creator } from "./Creator";
import { Package } from "./packageModel";
import { Review } from "./Review";
import { Tag } from "./Tag";

export interface Service {
  _id: string;
  creator: Creator;
  title: string;
  description?: string;
  category?: string;
  subCategory?: string;
  tags?: Tag[];
  countries?: string[];
  imageKeys?: string[];
  packages: Package[];
  step?: number;
  isDraft?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  reviews: Review[];
  rateCount: number;
  rate: number;
  packageSize: "small" | "medium" | "big";
}
