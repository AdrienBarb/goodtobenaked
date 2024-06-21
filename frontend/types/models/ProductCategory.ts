import { ProductSubCategory } from "./ProductSubCategory";

export type ProductCategory = {
  name: string;
  slug: {
    current: string;
    _type: string;
  };
  subCategories: ProductSubCategory[];
};
