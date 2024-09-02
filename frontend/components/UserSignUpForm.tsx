"use client";

import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import styles from "@/styles/Form.module.scss";
import { useSearchParams } from "next/navigation";
import LoadingButton from "@/components/Buttons/LoadingButton";
import CustomTextField from "@/components/Inputs/TextField";

import { Checkbox } from "@mui/material";
import { IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import userAuthService from "@/features/user-auth/userAuthService";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import { Link, useRouter } from "@/navigation";
import { appRouter } from "@/appRouter";
import { sendEvent } from "@/lib/analytics/fathom/trackHelper";

const UserSignUpForm = () => {
  //router
  const router = useRouter();
  const searchParams = useSearchParams();
  const referral = searchParams.get("referral");

  //translation
  const t = useTranslations();

  //localstate
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleClickShowPasswordConfirmation = () => {
    setShowPasswordConfirmation((prevShowPassword) => !prevShowPassword);
  };

  const validationSchema = yup.object({
    pseudo: yup
      .string()
      .matches(/^[a-zA-Z0-9._-]{3,30}$/, t("error.pseudo_invalid"))
      .required(t("error.field_required")),
    email: yup
      .string()
      .email(t("error.field_not_valid"))
      .required(t("error.field_required")),
    password: yup
      .string()
      .required(t("error.field_required"))
      .min(8, t("error.password_to_short")),
    passwordConfirmation: yup
      .string()
      .required(t("error.field_required"))
      .min(8, t("error.password_to_short")),
    isOver18: yup.bool().oneOf([true], t("error.field_required")),
    isLegalAccepted: yup.bool().oneOf([true], t("error.field_required")),
  });

  const formik = useFormik({
    initialValues: {
      pseudo: "",
      email: "",
      password: "",
      passwordConfirmation: "",
      isOver18: false,
      isLegalAccepted: false,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      if (values.password !== values.passwordConfirmation) {
        toast.error(t("error.password_confirmation_invalid"));
        return;
      }

      setIsLoading(true);

      try {
        const response = await userAuthService.register({
          ...values,
          referral: referral,
        });

        if (response) {
          const login = await signIn("credentials", {
            email: values.email,
            password: values.password,
            redirect: false,
          });

          if (login?.ok) {
            sendEvent("new user");
            router.push(appRouter.userType);
          }
        }

        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    },
  });

  return (
    <>
      <div className={styles.container}>
        <form onSubmit={formik.handleSubmit} className={styles.form}>
          <CustomTextField
            variant="standard"
            fullWidth
            id="pseudo"
            name="pseudo"
            label={t("common.pseudo")}
            value={formik.values.pseudo}
            onChange={formik.handleChange}
            error={formik.touched.pseudo && Boolean(formik.errors.pseudo)}
            helperText={formik.touched.pseudo && formik.errors.pseudo}
          />
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
              // add this
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
          <CustomTextField
            variant="standard"
            fullWidth
            type={showPasswordConfirmation ? "text" : "password"}
            id="passwordConfirmation"
            name="passwordConfirmation"
            label={t("common.passwordConfirmation")}
            value={formik.values.passwordConfirmation}
            onChange={formik.handleChange}
            error={
              formik.touched.passwordConfirmation &&
              Boolean(formik.errors.passwordConfirmation)
            }
            helperText={
              formik.touched.passwordConfirmation &&
              formik.errors.passwordConfirmation
            }
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPasswordConfirmation}
                  >
                    {showPasswordConfirmation ? (
                      <Visibility />
                    ) : (
                      <VisibilityOff />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <div>
            <div className={styles.checkboxWrapper}>
              <Checkbox
                name="isOver18"
                checked={formik.values.isOver18}
                onChange={formik.handleChange}
                sx={{
                  color: "black",
                  padding: "0",
                  "&.Mui-checked": {
                    color: "black",
                  },
                }}
              />
              <div className={styles.text}>{t("common.over_18")}</div>
            </div>
            {formik.errors.isOver18 && (
              <div className={styles.error}>
                {t("common.over_18_helper_text")}
              </div>
            )}
          </div>
          <div>
            <div className={styles.checkboxWrapper}>
              <Checkbox
                name="isLegalAccepted"
                checked={formik.values.isLegalAccepted}
                onChange={formik.handleChange}
                sx={{
                  color: "black",
                  padding: "0",
                  "&.Mui-checked": {
                    color: "black",
                  },
                }}
              />
              <div className={styles.text}>
                {t("common.i_read")}{" "}
                <Link className={styles.bold} href={"/legal/privacy"}>
                  {t("common.privacy")}
                </Link>{" "}
                {t("common.and")}{" "}
                <Link className={styles.bold} href="/legal/terms-of-use">
                  {t("common.terms")}
                </Link>
              </div>
            </div>
            {formik.errors.isLegalAccepted && (
              <div className={styles.error}>
                {t("common.legal_helper_text")}
              </div>
            )}
          </div>
          <LoadingButton fullWidth type="submit" loading={isLoading}>
            {t("common.signUp")}
          </LoadingButton>
        </form>
      </div>
    </>
  );
};

export default UserSignUpForm;
