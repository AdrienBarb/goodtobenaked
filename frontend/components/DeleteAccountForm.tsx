"use client";

import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import styles from "@/styles/Form.module.scss";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import CustomTextField from "./Inputs/TextField";
import CustomLoadingButton from "./Buttons/LoadingButton";
import useApi from "@/lib/hooks/useApi";
import { useRouter } from "@/navigation";
import { signOut } from "next-auth/react";

const validationSchema = yup.object({
  password: yup.string().required("Old Password is required"),
});

const DeleteAccountForm = () => {
  //router
  const router = useRouter();
  const t = useTranslations();

  const { usePut } = useApi();

  const { mutate: deleteAccount, isLoading } = usePut(
    `/api/users/delete-account`,
    {
      onSuccess: () => {
        signOut({
          redirect: true,
          callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/`,
        });
      },
    }
  );

  const formik = useFormik({
    initialValues: {
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      deleteAccount(values);
    },
  });

  return (
    <div className={styles.container}>
      <form onSubmit={formik.handleSubmit} className={styles.form}>
        <CustomTextField
          variant="standard"
          fullWidth
          id="password"
          name="password"
          type="password"
          label={t("settings.password")}
          value={formik.values.password}
          onChange={formik.handleChange}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
        />

        <CustomLoadingButton
          fullWidth
          type="submit"
          loading={isLoading}
          sx={{ backgroundColor: "red" }}
        >
          {t("common.deleteMyAccount")}
        </CustomLoadingButton>
      </form>
    </div>
  );
};

export default DeleteAccountForm;
