export interface ShippingFee {
  _id: string;
  region: string;
  countries: string[];
  fees: {
    small: number;
    medium: number;
    large: number;
  };
}
