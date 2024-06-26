"use client";

import React from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import styles from "@/styles/Form.module.scss";
import LoadingButton from "@/components/Buttons/LoadingButton";
import CustomTextField from "@/components/Inputs/TextField";
import { resetPasswordRequest } from "@/features/forgot-password/forgotPasswordSlice";
import { useSelector } from "react-redux";
import { RootStateType, useAppDispatch } from "@/store/store";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

const UserForgotPasswordForm = () => {
  const { locale } = useParams<{ locale: string }>();
  const t = useTranslations();
  const dispatch = useAppDispatch();
  const state = useSelector((state: RootStateType) => state.forgotPassword);

  const validationSchema = yup.object({
    email: yup
      .string()
      .email(t("error.field_not_valid"))
      .required(t("error.field_required")),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      dispatch(
        resetPasswordRequest({
          ...values,
          locale,
        })
      );
    },
  });

  if (state.isPasswordRequestSuccess) {
    return (
      <div className={styles.emailConfirmationWrapper}>
        <div className={styles.title}>{t("common.email_has_been_send")}</div>
        <div className={styles.email}>{formik.values.email}</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <form onSubmit={formik.handleSubmit} className={styles.form}>
        <CustomTextField
          variant="standard"
          fullWidth
          id="email"
          name="email"
          label={t("common.email")}
          value={formik.values.email}
          onChange={formik.handleChange}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
        />
        <LoadingButton
          fullWidth
          type="submit"
          loading={state.isPasswordRequestLoading}
        >
          {t("common.send")}
        </LoadingButton>
      </form>
    </div>
  );
};

export default UserForgotPasswordForm;
