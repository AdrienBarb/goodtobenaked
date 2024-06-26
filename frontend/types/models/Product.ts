import { Creator } from "./Creator";
import { SubCategory } from "./SubCategory";
import { Tag } from "./Tag";
import { Package } from "./packageModel";

export interface Product {
  _id: string;
  userId: Creator;
  permanent: boolean;
  category: string;
  subCategoryId?: SubCategory;
  name: string;
  description?: string;
  material?: string;
  duration?: string;
  activity?: string;
  price: number;
  serviceFee: number;
  serviceFeeVat: number;
  totalPrice: number;
  firstPackageTotalPrice: number;
  productPicturesKeys?: string[];
  favoriteUsers?: string[];
  favoriteCounter: number;
  saleState: "active" | "sold";
  visibility: "private" | "public";
  packageSize: "small" | "medium" | "big";
  packages: Package[];
  isDraft: boolean;
  withOptions: boolean;
  productType: "physical" | "virtual";
  tags: Tag[];
  formStep: number;
  version: number;
  createdAt?: Date;
  updatedAt?: Date;
}
