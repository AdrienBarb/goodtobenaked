import { Nude } from "./Nude";
import { User } from "./User";

interface Amount {
  baseValue: number;
  commission: number;
  baseValueWithCommission: number;
  creditValue: number;
  currency: "USD" | "EUR";
}

export interface Sale {
  _id: string;
  owner: User;
  fromUser: User;
  amount: Amount;
  saleType: "nude" | "commission" | "tip";
  nude?: Nude;
  isPaid: boolean;
  createdAt: Date;
  updatedAt: Date;
}
