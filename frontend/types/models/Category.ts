import { SubCategory } from "./SubCategory";

export type Category = {
  _id: string;
  name: string;
  subCategories: string[] | SubCategory[];
  createdAt?: Date;
  updatedAt?: Date;
};
