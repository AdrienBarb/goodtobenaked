"use client";

import React, { FC, useEffect, useState } from "react";
import styles from "@/styles/CreateNude.module.scss";
import { useFormik } from "formik";
import * as yup from "yup";
import { getMediaPrice } from "@/lib/utils/price";
import { Media } from "@/types/models/Media";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import GalleryModal from "@/components/GalleryModal";
import CustomTextField from "./Inputs/TextField";
import CustomLoadingButton from "./Buttons/LoadingButton";
import InputWrapper from "./InputWrapper";
import { useTranslations } from "next-intl";
import { useParams, useSearchParams } from "next/navigation";
import { useRouter } from "@/navigation";
import useApi from "@/lib/hooks/useApi";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import GalleryCard from "./GalleryCard";
import CustomSlider from "./CustomSlider";
import Select from "react-select";
import { TAGS, TagsType, tagList } from "@/constants/constants";

interface CreateNudeProps {}

const CreateNude: FC<CreateNudeProps> = () => {
  //session
  const { data: session } = useSession();

  //localstate
  const [openGalleryModal, setOpenGalleryModal] = useState(false);
  const [selectedMedias, setSelectedMedias] = useState<Media[]>([]);
  const [fetchedPrice, setFetchedPrice] = useState<number>(0);

  //hooks
  const { usePost, fetchData, usePut } = useApi();

  const { locale } = useParams();

  //traduction
  const t = useTranslations();

  //router
  const router = useRouter();
  const searchParams = useSearchParams();
  const nudeId = searchParams.get("nudeId");

  const { mutate: createNude, isLoading } = usePost(`/api/nudes`, {
    onSuccess: (nude) => {
      if (session?.user?.isAccountVerified) {
        router.push(
          `/dashboard/account/add/nudes/success?createdNudeId=${nude._id}`
        );
      } else {
        router.push(`/dashboard/community/${session?.user?.id}`);
      }
    },
  });

  const { mutate: editNude, isLoading: isEditLoading } = usePut(
    `/api/nudes/${nudeId}`,
    {
      onSuccess: () => {
        router.push(`/dashboard/community/${session?.user?.id}`);
      },
    }
  );

  const getCurrentNude = async () => {
    try {
      const currentNude = await fetchData(`/api/nudes/${nudeId}`);

      formik.setFieldValue("description", currentNude?.description);
      formik.setFieldValue("price", currentNude.priceDetails.fiatPrice / 100);
      formik.setFieldValue("tags", [
        ...TAGS.filter((el) => currentNude.tags.includes(el.value)),
      ]);
      setFetchedPrice(currentNude.priceDetails.fiatPrice / 100);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (nudeId) {
      getCurrentNude();
    }
  }, [nudeId]);

  const validationSchema = yup.object({
    description: yup
      .string()
      .required(t("error.field_required"))
      .label(t("error.enterDescription")),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      price: 0,
      description: "",
      tags: [],
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      if (!nudeId && selectedMedias.length === 0) {
        toast.error(t("error.missingMedias"));
        return;
      }

      nudeId
        ? editNude({
            description: values.description,
            isFree: values.price === 0,
            price: values.price,
            tags: values.tags.map((t: TagsType) => t.value),
          })
        : createNude({
            selectedMedias: selectedMedias.map((m) => m._id),
            description: values.description,
            isFree: values.price === 0,
            price: values.price,
            visibility: "public",
            tags: values.tags.map((t: TagsType) => t.value),
          });
    },
  });

  const totalPrice = getMediaPrice(formik.values.price || 0);

  const handleSubmitForm = () => {
    formik.handleSubmit();
  };

  const handleOpenGallery = () => {
    setOpenGalleryModal(true);
  };

  const handleClickOnDelete = (mediaId: string) => {
    setSelectedMedias((prev) => prev.filter((m: Media) => m._id !== mediaId));
  };

  return (
    <form className={styles.container}>
      {!nudeId && (
        <InputWrapper label={t("common.imageorVideo")}>
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
      )}
      <InputWrapper label={t("common.descriptionForm")}>
        <CustomTextField
          variant="outlined"
          fullWidth
          id="description"
          name="description"
          placeholder={t("common.descriptionForm")}
          multiline
          rows={4}
          value={formik.values.description}
          onChange={formik.handleChange}
          error={
            formik.touched.description && Boolean(formik.errors.description)
          }
          helperText={
            formik.touched.description && formik.errors.description
              ? formik.errors.description
              : `${300 - formik.values.description.length}`
          }
          inputProps={{
            maxLength: 300,
          }}
        />
      </InputWrapper>

      <InputWrapper
        label={t("common.price")}
        subLabel={
          <div className={styles.creditHelperText}>
            {t("common.creditHelperText", { creditAmount: totalPrice })}
            <a
              href={
                process.env.NEXT_PUBLIC_BASE_URL +
                `/${locale}/blog/articles/une-nouvelle-methode-de-paiement`
              }
              target="_blank"
            >
              {t("common.here")}
            </a>
            .
          </div>
        }
      >
        <div className={styles.sliderWrapper}>
          <CustomSlider
            setValue={(value: number) => formik.setFieldValue("price", value)}
            fetchedPrice={fetchedPrice}
          />
        </div>
      </InputWrapper>

      <InputWrapper label={t("common.tags")}>
        <Select
          name="tags"
          className={styles.multiSelect}
          onChange={(selectedOptions) =>
            formik.setFieldValue("tags", selectedOptions)
          }
          options={tagList.map((currentTag) => {
            return {
              value: currentTag,
              label: t(`nudeCategories.${currentTag}`),
            };
          })}
          value={formik.values.tags}
          classNamePrefix="react-select"
          getOptionLabel={(el: TagsType) => el.label}
          getOptionValue={(el: TagsType) => el.value}
          closeMenuOnSelect={false}
          placeholder={t("common.selectTagPlaceholder")}
          noOptionsMessage={() => <span>{t("common.noOtpions")}</span>}
          styles={{
            control: (styles) => ({
              ...styles,
              backgroundColor: "transparent",
              boxShadow: "none",
              outline: "none",
              border: "1px solid rgba(0, 0, 0, 0.3)",
              ":hover": {
                border: "1px solid black",
              },
            }),
            option: (styles, { data, isDisabled, isFocused, isSelected }) => ({
              ...styles,
              backgroundColor: isDisabled
                ? undefined
                : isSelected
                ? "#d9d7f6"
                : isFocused
                ? "#d9d7f6"
                : undefined,
            }),
            menuList: (styles) => ({
              ...styles,
              backgroundColor: "#fff0eb",
              borderRadius: "6px",
            }),
            multiValue: (styles) => ({
              ...styles,
              backgroundColor: "#cecaff",
            }),
            multiValueLabel: (styles) => ({
              ...styles,
              color: "white",
            }),
            multiValueRemove: (styles) => ({
              ...styles,
              color: "white",
            }),
            noOptionsMessage: (styles) => ({
              ...styles,
              color: "black",
            }),
            placeholder: (styles) => ({
              ...styles,
              color: "rgba(0, 0, 0, 0.3)",
            }),
          }}
          isMulti
        />
      </InputWrapper>

      <CustomLoadingButton
        fullWidth
        onClick={handleSubmitForm}
        loading={isLoading || isEditLoading}
      >
        {nudeId ? t("common.edit") : t("common.validate")}
      </CustomLoadingButton>

      <GalleryModal
        open={openGalleryModal}
        setOpen={setOpenGalleryModal}
        setSelectedMedias={setSelectedMedias}
        selectedMedias={selectedMedias}
        multiple={true}
        mediaType={["image", "video"]}
      />
    </form>
  );
};

export default CreateNude;
