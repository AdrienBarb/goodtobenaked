type FormDataValues = {
  productId?: string | undefined;
  name: string;
  description: string;
  price: number | string;
  subCategoryId: string;
  productVisibility: string;
  serviceFee: number;
  serviceFeeVat: number;
  totalPrice: number;
  packageSize: string;
  productPicture1?: File;
  productPicture2?: File;
  productPicture3?: File;
  material: string;
  duration: string;
  activity: string;
};

export const createFormData = (values: FormDataValues): FormData => {
  const formData = new FormData();

  for (const [key, value] of Object.entries(values)) {
    if (value !== undefined) {
      const valueToAppend =
        typeof value === "number" ? value.toString() : value;
      formData.append(key, valueToAppend);
    }
  }

  return formData;
};
