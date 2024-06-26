"use client";

import React, { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import styles from "@/styles/Form.module.scss";
import LoadingButton from "@/components/Buttons/LoadingButton";
import CustomTextField from "@/components/Inputs/TextField";
import { IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import { appRouter } from "@/appRouter";
import { useRouter } from "@/navigation";
import { useSearchParams } from "next/navigation";

const UserSignInForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const t = useTranslations();
  const router = useRouter();
  const searchParams = useSearchParams();
  const previousPath = searchParams.get("previousPath");

  const handleClickShowPassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const validationSchema = yup.object({
    email: yup
      .string()
      .email(t("error.field_not_valid"))
      .required(t("error.field_required")),
    password: yup
      .string()
      .required(t("error.field_required"))
      .min(8, t("error.password_to_short")),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      const login = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (login?.ok) {
        toast.success(t("success.login"));
        router.push(previousPath ? previousPath : appRouter.feed);
      } else {
        toast.error(t("error.credentials"));
      }
      setIsLoading(false);
    },
  });

  return (
    <div className={styles.container}>
      <form onSubmit={formik.handleSubmit} className={styles.form}>
        <CustomTextField
          variant="standard"
          fullWidth
          id="email"
          name="email"
          label="Email"
          value={formik.values.email}
          onChange={formik.handleChange}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
        />
        <CustomTextField
          variant="standard"
          fullWidth
          type={showPassword ? "text" : "password"}
          id="password"
          name="password"
          label={t("common.password")}
          value={formik.values.password}
          onChange={formik.handleChange}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                >
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <LoadingButton fullWidth type="submit" loading={isLoading}>
          {t("common.signIn")}
        </LoadingButton>
      </form>
    </div>
  );
};

export default UserSignInForm;
