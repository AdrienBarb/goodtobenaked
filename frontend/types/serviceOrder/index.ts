export type CreateServiceOrderArgumentTypes = {
  buyerId: string;
  sellerId: string;
  serviceId: string;
  packageId: string;
  optionsIds: string[];
};

export type CheckoutServiceOrderArgumentTypes = {
  orderId: string;
  cost: number;
  deliveryCost?: number;
  addressId?: string;
  instruction?: string;
};
