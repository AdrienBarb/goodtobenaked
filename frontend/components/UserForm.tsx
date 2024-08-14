"use client";

import React, { useEffect, useState, useRef, FC } from "react";
import { useFormik } from "formik";
import styles from "@/styles/Form.module.scss";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import * as yup from "yup";
import {
  BODY_TYPE,
  HAIR_COLOR,
  ageValues,
  countries,
} from "@/constants/formValue";
import LoadingButton from "@/components/Buttons/LoadingButton";
import CustomTextField from "@/components/Inputs/TextField";
import EditIcon from "@mui/icons-material/Edit";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import { useRouter } from "@/navigation";
import userService from "@/features/user/userService";
import { Gender } from "@/types/models/genderModel";
import { User } from "@/types/models/User";
import useApi from "@/lib/hooks/useApi";
import axios from "axios";
import Pica from "pica";

interface Props {
  initialUserDatas: User;
  genderCategories: Gender[];
  nextPage: string;
}

const UserForm: FC<Props> = ({
  initialUserDatas,
  genderCategories,
  nextPage,
}) => {
  const { _id: userId } = initialUserDatas;

  //router
  const router = useRouter();

  //traduction
  const t = useTranslations();

  //localstate
  const [imageProfil, setImageProfil] = useState(
    initialUserDatas.image?.profil
  );

  const [currentUser, setCurrentUser] = useState(initialUserDatas);

  const profilInput = useRef<HTMLInputElement>(null);

  const { usePut, useGet, fetchData } = useApi();

  const { mutate: doPost, isLoading } = usePut("/api/users/owner", {
    onSuccess: () => {
      router.push(nextPage);
    },
  });

  const getCurrentUser = async () => {
    try {
      const r = await fetchData(`/api/users/owner`);

      setCurrentUser(r);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (userId) {
      getCurrentUser();
    }
  }, [userId]);

  const validationSchema = yup.object({
    pseudo: yup.string().required("Pseudo is required"),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      pseudo: currentUser.pseudo,
      description: currentUser.description ?? "",
      age: currentUser.age ?? "",
      gender: currentUser.gender?._id ?? "",
      bodyType: currentUser.bodyType ?? "",
      hairColor: currentUser.hairColor ?? "",
      country: currentUser.country ?? "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const formValues = {
        description: values.description,
        pseudo: values.pseudo,
        age: typeof values.age === "string" ? parseInt(values.age) : values.age,
        gender: values.gender,
        bodyType: values.bodyType,
        hairColor: values.hairColor,
        country: values.country,
      };

      doPost(formValues);
    },
  });

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!event.target.files) return;

    const file = event.target.files[0];
    const img = document.createElement("img");

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async (e) => {
      img.src = e.target?.result as string;
      img.onload = async () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const pica = Pica();

        const scaleFactor = 600 / Math.max(img.width, img.height);
        canvas.width = img.width * scaleFactor;
        canvas.height = img.height * scaleFactor;

        await pica.resize(img, canvas);

        const jpegBlob = await pica.toBlob(canvas, "image/jpeg", 1);

        const { signedUrl, profileImageUrl } =
          await userService.addProfilPicture({
            filetype: "image/jpeg",
          });

        await axios.put(signedUrl, jpegBlob, {
          headers: {
            "Content-Type": "image/jpeg",
          },
        });

        setImageProfil(profileImageUrl);
      };
    };
  };

  return (
    <>
      <div
        className={styles.formWrapper}
        style={{ backgroundColor: "transparent" }}
      >
        <form
          onSubmit={formik.handleSubmit}
          className={styles.form}
          style={{ marginTop: "2rem" }}
        >
          <div
            className={styles.imageWrapper}
            style={{
              ...(imageProfil && {
                backgroundImage: `url(${process.env.NEXT_PUBLIC_CLOUDFRONT_MEDIA}${imageProfil})`,
              }),
            }}
          >
            <input
              ref={profilInput}
              onChange={(e) => handleFileUpload(e)}
              type="file"
              style={{ display: "none" }}
              multiple={false}
              accept="image/png, image/jpeg"
            />

            <div
              className={clsx(styles.photoIcon, styles.profil)}
              onClick={() => {
                profilInput.current?.click();
              }}
            >
              <EditIcon sx={{ color: "#FFF0EB" }} fontSize="small" />
            </div>
          </div>

          <CustomTextField
            variant="outlined"
            fullWidth
            id="pseudo"
            name="pseudo"
            label={t("db.pseudo")}
            value={formik.values.pseudo}
            onChange={formik.handleChange}
            error={formik.touched.pseudo && Boolean(formik.errors.pseudo)}
            helperText={
              typeof formik.errors.pseudo === "string" && formik.errors.pseudo
            }
          />

          <CustomTextField
            variant="outlined"
            fullWidth
            id="description"
            name="description"
            label={t("db.description")}
            multiline
            rows={4}
            value={formik.values.description}
            onChange={formik.handleChange}
            error={
              formik.touched.description && Boolean(formik.errors.description)
            }
            helperText={
              typeof formik.errors.description === "string" &&
              formik.errors.description
            }
          />
          <FormControl variant="outlined" sx={{ minWidth: 200 }}>
            <CustomTextField
              label={t("db.country")}
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
            {typeof formik.errors.country === "string" &&
              formik.errors.country && (
                <FormHelperText sx={{ color: "red" }}>
                  {formik.errors.country}
                </FormHelperText>
              )}
          </FormControl>

          <div className={styles.selectWrapper}>
            <FormControl
              variant="outlined"
              sx={{ minWidth: 200, width: "100%" }}
            >
              <CustomTextField
                label={t("db.gender")}
                select
                id="gender"
                name="gender"
                value={formik.values.gender}
                onChange={formik.handleChange}
              >
                <MenuItem value="">
                  <em>{t("db.nothing")}</em>
                </MenuItem>
                {genderCategories.map(
                  (currentCategory: Gender, index: number) => {
                    return (
                      <MenuItem key={index} value={currentCategory._id}>
                        {t(`db.${currentCategory.name}`)}
                      </MenuItem>
                    );
                  }
                )}
              </CustomTextField>
              {typeof formik.errors.gender === "string" &&
                formik.errors.gender && (
                  <FormHelperText sx={{ color: "red" }}>
                    {formik.errors.gender}
                  </FormHelperText>
                )}
            </FormControl>
            <FormControl
              variant="outlined"
              sx={{ minWidth: 200, width: "100%" }}
            >
              <CustomTextField
                label={t("db.age")}
                select
                id="age"
                name="age"
                value={formik.values.age}
                onChange={formik.handleChange}
              >
                <MenuItem value="">
                  <em>{t("db.nothing")}</em>
                </MenuItem>
                {ageValues.map((el) => {
                  return <MenuItem key={el} value={el}>{`${el} ans`}</MenuItem>;
                })}
              </CustomTextField>
              {typeof formik.errors.age === "string" && formik.errors.age && (
                <FormHelperText sx={{ color: "red" }}>
                  {formik.errors.age}
                </FormHelperText>
              )}
            </FormControl>
          </div>
          <div className={styles.selectWrapper}>
            <FormControl
              variant="outlined"
              sx={{ minWidth: 200, width: "100%" }}
            >
              <CustomTextField
                label={t("db.body_type")}
                select
                id="bodyType"
                name="bodyType"
                value={formik.values.bodyType}
                onChange={formik.handleChange}
              >
                <MenuItem value="">
                  <em>{t("db.nothing")}</em>
                </MenuItem>
                {BODY_TYPE.map((el) => {
                  return (
                    <MenuItem key={el} value={el}>
                      {t(`db.${el}`)}
                    </MenuItem>
                  );
                })}
              </CustomTextField>
              {typeof formik.errors.bodyType === "string" &&
                formik.errors.bodyType && (
                  <FormHelperText sx={{ color: "red" }}>
                    {formik.errors.bodyType}
                  </FormHelperText>
                )}
            </FormControl>
            <FormControl
              variant="outlined"
              sx={{ minWidth: 200, width: "100%" }}
            >
              <CustomTextField
                label={t("db.hair_color")}
                select
                id="hairColor"
                name="hairColor"
                value={formik.values.hairColor}
                onChange={formik.handleChange}
              >
                <MenuItem value="">
                  <em>{t("db.nothing")}</em>
                </MenuItem>
                {HAIR_COLOR.map((el) => {
                  return (
                    <MenuItem key={el} value={el}>
                      {t(`db.${el}`)}
                    </MenuItem>
                  );
                })}
              </CustomTextField>
              {typeof formik.errors.hairColor === "string" &&
                formik.errors.hairColor && (
                  <FormHelperText sx={{ color: "red" }}>
                    {formik.errors.hairColor}
                  </FormHelperText>
                )}
            </FormControl>
          </div>

          <LoadingButton
            fullWidth
            loading={isLoading}
            onClick={() => formik.handleSubmit()}
          >
            {t("common.validate")}
          </LoadingButton>
        </form>
      </div>
    </>
  );
};

export default UserForm;
