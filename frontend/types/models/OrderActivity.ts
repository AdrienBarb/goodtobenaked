export interface OrderActivity {
  _id: string;
  fromUser?: string;
  type: string;
  message?: string;
  conflict?: string;
  createdAt: Date;
  updatedAt: Date;
}
