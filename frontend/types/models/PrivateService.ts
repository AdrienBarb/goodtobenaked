import { Creator } from "./Creator";

export interface PrivateService {
  _id: string;
  creator: Creator;
  title: string;
  price: number;
  serviceFee: number;
  serviceFeeVat: number;
  totalPrice: number;
  saleState: "active" | "sold";
}
