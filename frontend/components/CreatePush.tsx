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
import { Switch } from "@mui/material";
import Text from "./Text";
import { User } from "@/types/models/User";

interface CreatePushProps {}

const CreatePush: FC<CreatePushProps> = () => {
  //session
  const { data: session } = useSession();

  //localstate
  const [openGalleryModal, setOpenGalleryModal] = useState(false);
  const [selectedMedias, setSelectedMedias] = useState<Media[]>([]);
  const [fetchedPrice, setFetchedPrice] = useState<number>(0);
  const [selectedUserList, setSelectedUserList] = useState<string[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  //hooks
  const { usePost, fetchData } = useApi();
  const { locale } = useParams();

  //traduction
  const t = useTranslations();

  //router
  const router = useRouter();

  //other
  type UserList =
    | "notificationSubscribers"
    | "profileViewers"
    | "messageSenders"
    | "nudeBuyers";
  const USERS_LIST: UserList[] = [
    "notificationSubscribers",
    "profileViewers",
    "messageSenders",
    "nudeBuyers",
  ];

  const { mutate: createPush, isLoading } = usePost(`/api/nudes/push`, {
    onSuccess: () => {
      router.push(`/dashboard/community/${session?.user?.id}`);
    },
  });

  const getCurrentOwner = async () => {
    try {
      const r = await fetchData(`/api/users/owner`);

      setCurrentUser(r);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCurrentOwner();
  }, []);

  const validationSchema = yup.object({
    message: yup
      .string()
      .required(t("error.field_required"))
      .label(t("error.enterMessage")),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      price: 0,
      message: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      if (selectedMedias.length === 0) {
        toast.error(t("error.missingMedias"));
        return;
      }

      createPush({
        selectedMedias: selectedMedias.map((m) => m._id),
        message: values.message,
        isFree: values.price === 0,
        price: values.price,
        usersList: selectedUserList,
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

  const handleSelectedUsersListChange = (u: string) => {
    let clonedSelectedUsersList: string[] = [...selectedUserList];
    if (clonedSelectedUsersList.includes(u)) {
      clonedSelectedUsersList = [
        ...clonedSelectedUsersList.filter((el) => el !== u),
      ];
    } else {
      clonedSelectedUsersList = [...clonedSelectedUsersList, u];
    }

    setSelectedUserList(clonedSelectedUsersList);
  };

  return (
    <form className={styles.container}>
      <Text>{t("common.pushExplanation")}</Text>
      <InputWrapper label={t("common.whichGroupOfUsers")}>
        {USERS_LIST.map((currentUsersList: UserList, index: number) => {
          return (
            <div className={styles.switchWrapper} key={index}>
              <Text>{`${t(`common.${currentUsersList}`)} (${
                currentUser?.[currentUsersList]?.length || 0
              })`}</Text>

              <Switch
                checked={selectedUserList.includes(currentUsersList)}
                onChange={(e) =>
                  handleSelectedUsersListChange(currentUsersList)
                }
                sx={{
                  color: "#Cecaff !important",
                  ".Mui-checked": {
                    color: "#Cecaff !important",
                  },
                  ".MuiSwitch-track": {
                    backgroundColor: "#Cecaff !important",
                  },
                }}
              />
            </div>
          );
        })}
      </InputWrapper>

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

      <InputWrapper label={t("common.messageForm")}>
        <CustomTextField
          variant="outlined"
          fullWidth
          id="message"
          name="message"
          placeholder={t("common.message")}
          multiline
          rows={4}
          value={formik.values.message}
          onChange={formik.handleChange}
          error={formik.touched.message && Boolean(formik.errors.message)}
          helperText={formik.touched.message && formik.errors.message}
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

      <CustomLoadingButton
        fullWidth
        onClick={handleSubmitForm}
        loading={isLoading}
      >
        {t("common.validate")}
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

export default CreatePush;
