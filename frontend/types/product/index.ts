export type AddProductArgument = {
  name: string;
  description: string;
  permanent: boolean;
  category: string;
};

export type AddPrivateProductArgument = {
  name: string;
  packageSize: string;
  price: number;
  serviceFee: number;
  serviceFeeVat: number;
  totalPrice: number;
  productType: string;
};

export type EditProductArgument = {
  productId: string;
  formValues: AddProductArgument;
};

export type PackageOptionArgument = {
  name: string;
  additionalCost: number;
  serviceFee: number;
  serviceFeeVat: number;
  totalAdditionalCost: number;
};

export type PackageArgument = {
  name: string;
  title: string;
  description: string;
  price: number;
  serviceFee: number;
  serviceFeeVat: number;
  totalPrice: number;
  options: PackageOptionArgument[];
  packageOption: PackageOptionArgument;
};

export type EditProductPricingArgument = {
  productId: string;
  priceValues: {
    withOptions: boolean;
    productPrice?: {
      price: number;
      serviceFee: number;
      serviceFeeVat: number;
      totalPrice: number;
    };
    packagesValues?: PackageArgument[];
  };
};

export type EditProductDetailsArgument = {
  productId: string;
  details: {
    tags: string[];
    packageSize: string;
    material: string;
    duration: string;
    activity: string;
  };
};

export type EditProductGalleryArgument = {
  productId: string;
  formData: FormData;
};
