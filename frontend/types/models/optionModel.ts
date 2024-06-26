export interface Option {
  _id: string;
  name: string;
  additionalCost: number;
  serviceFee: number;
  serviceFeeVat: number;
  totalAdditionalCost: number;
  createdAt?: Date;
  updatedAt?: Date;
}
