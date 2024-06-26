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

const validationSchema = yup.object({
  oldPassword: yup.string().required("Old Password is required"),
  newPassword: yup.string().required("New Password is required"),
  newConfirmationPassword: yup
    .string()
    .required("New confirmation Password is required"),
});

const EditPasswordForm = () => {
  //router
  const router = useRouter();
  const t = useTranslations();

  const { usePut } = useApi();

  const { mutate: editUserPassword, isLoading } = usePut(
    `/api/users/edit-password`,
    {
      onSuccess: () => {
        router.push("/dashboard/account/parameters/my-account");
      },
    }
  );

  const formik = useFormik({
    initialValues: {
      oldPassword: "",
      newPassword: "",
      newConfirmationPassword: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      if (values.newPassword !== values.newConfirmationPassword) {
        toast.error(t("error.password_confirmation_invalid"));
        return;
      }

      editUserPassword(values);
    },
  });

  return (
    <div className={styles.container}>
      <form onSubmit={formik.handleSubmit} className={styles.form}>
        <CustomTextField
          variant="standard"
          fullWidth
          id="oldPassword"
          name="oldPassword"
          type="password"
          label={t("settings.old_password")}
          value={formik.values.oldPassword}
          onChange={formik.handleChange}
          error={
            formik.touched.oldPassword && Boolean(formik.errors.oldPassword)
          }
          helperText={formik.touched.oldPassword && formik.errors.oldPassword}
        />
        <CustomTextField
          variant="standard"
          fullWidth
          id="newPassword"
          name="newPassword"
          type="password"
          label={t("settings.new_password")}
          value={formik.values.newPassword}
          onChange={formik.handleChange}
          error={
            formik.touched.newPassword && Boolean(formik.errors.newPassword)
          }
          helperText={formik.touched.newPassword && formik.errors.newPassword}
        />
        <CustomTextField
          variant="standard"
          fullWidth
          id="newConfirmationPassword"
          name="newConfirmationPassword"
          type="password"
          label={t("settings.new_confirmation_password")}
          value={formik.values.newConfirmationPassword}
          onChange={formik.handleChange}
          error={
            formik.touched.newConfirmationPassword &&
            Boolean(formik.errors.newConfirmationPassword)
          }
          helperText={
            formik.touched.newConfirmationPassword &&
            formik.errors.newConfirmationPassword
          }
        />

        <CustomLoadingButton fullWidth type="submit" loading={isLoading}>
          {t("common.send")}
        </CustomLoadingButton>
      </form>
    </div>
  );
};

export default EditPasswordForm;
