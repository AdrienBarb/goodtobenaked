"use client";

import React from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import styles from "@/styles/Form.module.scss";
import { useTranslations } from "next-intl";
import CustomTextField from "./Inputs/TextField";
import { useRouter } from "@/navigation";
import CustomLoadingButton from "./Buttons/LoadingButton";
import { useSession } from "next-auth/react";
import useApi from "@/lib/hooks/useApi";

const validationSchema = yup.object({
  email: yup
    .string()
    .email("Enter a valid email")
    .required("Email is required"),
  password: yup.string().required("Password is required"),
});

const EditEmailForm = () => {
  //redux
  const { data: session, update } = useSession();

  //traduction
  const t = useTranslations();

  //router
  const router = useRouter();

  const { usePut } = useApi();

  const { mutate: editUserEmail, isLoading } = usePut(`/api/users/edit-email`, {
    onSuccess: ({ email, emailVerified }) => {
      if (session) {
        const updatedSession = {
          ...session,
          user: {
            ...session.user,
            emailVerified: emailVerified,
            email: email,
          },
        };

        update(updatedSession);
        if (session?.user?.userType === "creator") {
          router.push(
            "/dashboard/account/parameters/my-account/edit/email/verification"
          );
        } else {
          router.push("/dashboard/account/parameters/my-account");
        }
      }
    },
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      editUserEmail(values);
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
          label={t("common.password")}
          value={formik.values.password}
          onChange={formik.handleChange}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
        />
        <CustomTextField
          variant="standard"
          fullWidth
          id="email"
          name="email"
          label={t("common.new_email")}
          value={formik.values.email}
          onChange={formik.handleChange}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
        />
        <CustomLoadingButton fullWidth type="submit" loading={isLoading}>
          {t("common.send")}
        </CustomLoadingButton>
      </form>
    </div>
  );
};

export default EditEmailForm;
