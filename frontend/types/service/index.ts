export type CreateServiceArgument = {
  title: string;
  description: string;
  category: string;
  subCategory?: string;
  packageSize?: string;
  tags: string[];
};

export type CreatePrivateServiceArgument = {
  title: string;
  price: number;
  serviceFee: number;
  serviceFeeVat: number;
  totalPrice: number;
};

export type EditServiceArgument = {
  _id: string;
  title: string;
  description: string;
  category: string;
  subCategory?: string;
  packageSize?: string;
  tags: string[];
};

export type EditServiceGalleryArgument = {
  _id: string;
  formData: FormData;
};

export type EditServicePricingArgument = {
  _id: string;
  packages: {
    name: string;
    title: string;
    description: string;
    price: string | number;
    options: {
      name: string;
      additionalCost: string | number;
    }[];
    packageOption: {
      name: string;
      additionalCost: string | number;
    };
  }[];
};
