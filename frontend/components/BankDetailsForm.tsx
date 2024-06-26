"use client";

import React, { useState, useEffect, FC } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useTranslations } from "next-intl";
import CustomTextField from "./Inputs/TextField";
import CustomLoadingButton from "./Buttons/LoadingButton";
import useApi from "@/lib/hooks/useApi";
import styles from "@/styles/Form.module.scss";
import { FormControl, FormHelperText, MenuItem } from "@mui/material";
import InputLabel from "./InputLabel";
import { countries } from "@/constants/formValue";
import { useRouter } from "@/navigation";

interface Props {
  nextPath: string;
}

const BankDetailsForm: FC<Props> = ({ nextPath }) => {
  const t = useTranslations();
  const router = useRouter();

  //localstate
  const [bankValues, setBankValues] = useState({
    name: "",
    iban: "",
    street: "",
    zip: "",
    city: "",
    country: "",
  });

  const validationSchema = yup.object({
    name: yup.string().required(t("error.field_required")),
    iban: yup.string().required(t("error.field_required")),
    street: yup.string().required(t("error.field_required")),
    zip: yup.string().required(t("error.field_required")),
    city: yup.string().required(t("error.field_required")),
    country: yup.string().required(t("error.field_required")),
  });

  const { usePut, fetchData } = useApi();

  const { mutate: editBankDetails, isLoading } = usePut(
    "/api/users/bank-details",
    {
      onSuccess: () => {
        router.push(nextPath);
      },
    }
  );

  const getCurrentOwner = async () => {
    try {
      const r = await fetchData(`/api/users/owner`);

      setBankValues({
        ...bankValues,
        name: r?.bankAccount?.name,
        iban: r?.bankAccount?.iban,
        street: r?.bankAccount?.address?.street,
        zip: r?.bankAccount?.address?.zip,
        city: r?.bankAccount?.address?.city,
        country: r?.bankAccount?.address?.country,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCurrentOwner();
  }, []);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: bankValues.name,
      iban: bankValues.iban,
      street: bankValues.street,
      zip: bankValues.zip,
      city: bankValues.city,
      country: bankValues.country,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      editBankDetails({
        name: values.name,
        iban: values.iban,
        street: values.street,
        zip: values.zip,
        city: values.city,
        country: values.country,
      });
    },
  });

  return (
    <form className={styles.form}>
      <CustomTextField
        variant="standard"
        fullWidth
        id="name"
        name="name"
        label={t("settings.bank_account_name_label")}
        value={formik.values.name}
        onChange={formik.handleChange}
        error={formik.touched.name && Boolean(formik.errors.name)}
        helperText={formik.touched.name && formik.errors.name}
      />
      <CustomTextField
        variant="standard"
        fullWidth
        id="iban"
        name="iban"
        label={t("settings.bank_account_iban_label")}
        value={formik.values.iban}
        onChange={formik.handleChange}
        error={formik.touched.iban && Boolean(formik.errors.iban)}
        helperText={formik.touched.iban && formik.errors.iban}
      />
      <CustomTextField
        variant="standard"
        fullWidth
        id="street"
        label={t("settings.address")}
        onChange={formik.handleChange}
        value={formik.values.street}
        error={formik.touched.street && Boolean(formik.errors.street)}
        helperText={formik.touched.street && formik.errors.street}
      />
      <CustomTextField
        variant="standard"
        fullWidth
        id="zip"
        label={t("settings.zip_code")}
        onChange={formik.handleChange}
        value={formik.values.zip}
        error={formik.touched.zip && Boolean(formik.errors.zip)}
        helperText={formik.touched.zip && formik.errors.zip}
      />
      <CustomTextField
        variant="standard"
        fullWidth
        id="city"
        label={t("settings.city")}
        onChange={formik.handleChange}
        value={formik.values.city}
        error={formik.touched.city && Boolean(formik.errors.city)}
        helperText={formik.touched.city && formik.errors.city}
      />
      <FormControl variant="outlined" sx={{ minWidth: 200 }}>
        <CustomTextField
          label={t("settings.country")}
          variant="standard"
          select
          id="country"
          name="country"
          value={formik.values.country}
          onChange={formik.handleChange}
        >
          <MenuItem value="">
            <em>{t("db.nothing")}</em>
          </MenuItem>
          {countries.map((el) => {
            return (
              <MenuItem key={el.value} value={el.value}>
                {t(`db.${el.label}`)}
              </MenuItem>
            );
          })}
        </CustomTextField>
        {formik.touched.country &&
          typeof formik.errors.country === "string" &&
          formik.errors.country && (
            <FormHelperText sx={{ color: "red" }}>
              {formik.errors.country}
            </FormHelperText>
          )}
      </FormControl>
      <CustomLoadingButton
        sx={{ marginTop: "2rem" }}
        fullWidth
        loading={isLoading}
        onClick={() => formik.handleSubmit()}
      >
        {t("common.validate")}
      </CustomLoadingButton>
    </form>
  );
};

export default BankDetailsForm;
