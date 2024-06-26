export type createProductOrderArgumentTypes = {
  productId: string;
  sellerId: string;
  withOptions: boolean;
  packageId?: string;
  optionsIds?: string[];
};

export type checkoutProductOrderArgumentTypes = {
  orderId: string;
  addressId: string;
  cost: number;
  deliveryCost: number;
  instruction?: string;
};
