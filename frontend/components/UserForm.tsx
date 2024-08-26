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
import InputWrapper from "./InputWrapper";
import { Media } from "@/types/models/Media";
import GalleryModal from "./GalleryModal";
import GalleryCard from "./GalleryCard";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { revalidatePath } from "next/cache";

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
  const [imageProfil, setImageProfil] = useState(initialUserDatas.profileImage);
  const [currentUser, setCurrentUser] = useState(initialUserDatas);
  const [openGalleryModal, setOpenGalleryModal] = useState(false);
  const [selectedMedias, setSelectedMedias] = useState<Media[]>([]);

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
      setSelectedMedias(r.secondaryProfileImages);
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
    pseudo: yup
      .string()
      .matches(/^[a-zA-Z0-9._-]{3,30}$/, t("error.pseudo_invalid"))
      .required("Pseudo is required"),
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
        secondaryProfileImages: selectedMedias.map((m) => m._id),
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

  const handleOpenGallery = () => {
    setOpenGalleryModal(true);
  };

  const handleClickOnDelete = (mediaId: string) => {
    setSelectedMedias((prev) => prev.filter((m: Media) => m._id !== mediaId));
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

          <InputWrapper label={t("common.secondaryPictureProfile")}>
            <div className={styles.mediaContainer}>
              <div className={styles.add} onClick={handleOpenGallery}>
                <AddCircleIcon
                  sx={{ fontSize: "48", cursor: "pointer", color: "white" }}
                />
              </div>
              {selectedMedias.map(
                (currentLocalSelectedMedia: Media, index: number) => {
                  return (
                    <div className={styles.media} key={index}>
                      <GalleryCard
                        media={currentLocalSelectedMedia}
                        deleteAction={() =>
                          handleClickOnDelete(currentLocalSelectedMedia._id)
                        }
                      />
                    </div>
                  );
                }
              )}
            </div>
          </InputWrapper>

          <InputWrapper label={t("db.pseudo")}>
            <CustomTextField
              variant="outlined"
              fullWidth
              id="pseudo"
              name="pseudo"
              value={formik.values.pseudo}
              onChange={formik.handleChange}
              error={formik.touched.pseudo && Boolean(formik.errors.pseudo)}
              helperText={
                typeof formik.errors.pseudo === "string" && formik.errors.pseudo
              }
            />
          </InputWrapper>

          <InputWrapper label={t("db.description")}>
            <CustomTextField
              variant="outlined"
              fullWidth
              id="description"
              name="description"
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
          </InputWrapper>

          <InputWrapper label={t("db.country")}>
            <FormControl
              variant="outlined"
              sx={{ minWidth: 200, width: "100%" }}
            >
              <CustomTextField
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
          </InputWrapper>

          <div className={styles.selectWrapper}>
            <InputWrapper label={t("db.gender")}>
              <FormControl
                variant="outlined"
                sx={{ minWidth: 200, width: "100%" }}
              >
                <CustomTextField
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
            </InputWrapper>
            <InputWrapper label={t("db.age")}>
              <FormControl
                variant="outlined"
                sx={{ minWidth: 200, width: "100%" }}
              >
                <CustomTextField
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
                    return (
                      <MenuItem key={el} value={el}>{`${el} ans`}</MenuItem>
                    );
                  })}
                </CustomTextField>
                {typeof formik.errors.age === "string" && formik.errors.age && (
                  <FormHelperText sx={{ color: "red" }}>
                    {formik.errors.age}
                  </FormHelperText>
                )}
              </FormControl>
            </InputWrapper>
          </div>
          <div className={styles.selectWrapper}>
            <InputWrapper label={t("db.body_type")}>
              <FormControl
                variant="outlined"
                sx={{ minWidth: 200, width: "100%" }}
              >
                <CustomTextField
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
            </InputWrapper>
            <InputWrapper label={t("db.hair_color")}>
              <FormControl
                variant="outlined"
                sx={{ minWidth: 200, width: "100%" }}
              >
                <CustomTextField
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
            </InputWrapper>
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
      <GalleryModal
        open={openGalleryModal}
        setOpen={setOpenGalleryModal}
        setSelectedMedias={setSelectedMedias}
        selectedMedias={selectedMedias}
        multiple={true}
        mediaType={["image"]}
      />
    </>
  );
};

export default UserForm;
