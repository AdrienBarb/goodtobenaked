export interface Address {
  _id: string;
  name: string;
  company?: string;
  street_no?: string;
  street1: string;
  city: string;
  state?: string;
  zip: string;
  country: string;
  formattedAddress?: string;
  latitude?: number;
  longitude?: number;
  shippoId?: string;
  email?: string;
  isHeadOffice?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
