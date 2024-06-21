import { Creator } from "./Creator";
import { Option } from "./optionModel";
import { Tag } from "./Tag";

export interface Package {
  _id: string;
  name: string;
  title: string;
  description?: string;
  price: number;
  serviceFee: number;
  serviceFeeVat: number;
  totalPrice: number;
  options: Option[];
  createdAt?: Date;
  updatedAt?: Date;
}
