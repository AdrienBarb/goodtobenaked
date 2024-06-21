export interface Message {
  _id: string;
  sender: string;
  text?: string;
  product?: string;
  nude?: string;
  seen: boolean;
  notified: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
