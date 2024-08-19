import React, { FC, useState } from "react";

import { Media } from "@/types/models/Media";
import { useTranslations } from "next-intl";
import { Modal } from "@mui/material";
import ModalHeader from "./ModalHeader";
import styles from "@/styles/PrivateNudeModal.module.scss";
import FullButton from "./Buttons/FullButton";
import GalleryModal from "./GalleryModal";
import InputWrapper from "./InputWrapper";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useFormik } from "formik";
import * as yup from "yup";
import CustomTextField from "./Inputs/TextField";
import { getMediaPrice } from "@/lib/utils/price";
import { useSelector } from "react-redux";
import { RootStateType, useAppDispatch } from "@/store/store";
import useApi from "@/lib/hooks/useApi";
import GalleryCard from "./GalleryCard";
import socket from "@/lib/socket/socket";
import { useParams } from "next/navigation";
import useConversationUsers from "@/lib/hooks/useConversationUsers";
import { Message } from "@/types/models/Message";
import CustomSlider from "./CustomSlider";
import { Conversation } from "@/types/models/Conversation";
import { useSession } from "next-auth/react";
import { getCreditAmount } from "@/features/user/userSlice";

interface Props {
  setOpen: (e: boolean) => void;
  open: boolean;
  conversation: Conversation;
  setMessagesList: (
    updateFunction: (previousMessages: Message[]) => Message[]
  ) => void;
}

const PrivateNudeModal: FC<Props> = ({
  setOpen,
  open,
  setMessagesList,
  conversation,
}) => {
  //traduction
  const t = useTranslations();

  //localstate
  const [openGalleryModal, setOpenGalleryModal] = useState(false);
  const [selectedMedias, setSelectedMedias] = useState<Media[]>([]);

  //redux
  const socketState = useSelector((state: RootStateType) => state.socket);
  const dispatch = useAppDispatch();

  //hooks
  const { usePost } = useApi();
  const { otherUser, currentUser } = useConversationUsers(
    conversation.participants
  );

  //router
  const { conversationId } = useParams<{ conversationId: string }>();

  const { data: session } = useSession();

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
      createNude({
        selectedMedias: selectedMedias.map((m) => m._id),
        isFree: values.price === 0,
        description: values.message,
        price: values.price,
        visibility: "private",
      });
    },
  });

  const { mutate: sendMessage, isLoading: isMessageCreateLoading } = usePost(
    `/api/conversations/${conversationId}/messages`,
    {
      onSuccess: (data) => {
        setMessagesList((previousMessages: Message[]) => [
          ...previousMessages,
          data,
        ]);

        if (
          socketState.onlineUsers.some((user) => user.userId === otherUser?._id)
        ) {
          socket?.emit("sendMessage", {
            senderId: currentUser?._id,
            receiverId: otherUser?._id,
            message: data,
          });

          socket?.emit("sendNotification", {
            receiverId: otherUser?._id,
            conversationId: conversationId,
          });
        }

        if (otherUser?.userType === "creator") {
          dispatch(getCreditAmount());
        }

        setSelectedMedias([]);
        formik.setFieldValue("message", "");
        formik.setFieldValue("price", 0);
        setOpen(false);
      },
    }
  );

  const { mutate: createNude, isLoading } = usePost(`/api/nudes`, {
    onSuccess: (createdNude) => {
      sendMessage({
        text: formik.values.message,
        nudeId: createdNude._id,
      });
    },
  });

  const handleClickOnDelete = (mediaId: string) => {
    setSelectedMedias((prev) => prev.filter((m: Media) => m._id !== mediaId));
  };

  const totalPrice = getMediaPrice(formik.values.price || 0);

  return (
    <Modal open={open} onClose={setOpen}>
      <>
        <div className={styles.container}>
          <div className={styles.wrapper}>
            <ModalHeader
              withCloseIcon={true}
              onClose={setOpen}
              title={t("conversation.sendNude")}
            />
            <div className={styles.content}>
              <InputWrapper label={t("common.imageorVideo")}>
                <div className={styles.mediaContainer}>
                  <div
                    className={styles.add}
                    onClick={() => setOpenGalleryModal(true)}
                  >
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
                  error={
                    formik.touched.message && Boolean(formik.errors.message)
                  }
                  helperText={formik.touched.message && formik.errors.message}
                />
              </InputWrapper>

              <InputWrapper
                label={t("common.price")}
                subLabel={
                  <div className={styles.creditHelperText}>
                    {t("common.creditHelperText", { creditAmount: totalPrice })}
                    <a
                      rel="noreferrer"
                      href={
                        process.env.NEXT_PUBLIC_BASE_URL +
                        "/support/creators/une-nouvelle-facon-de-vendre"
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
                    setValue={(value: number) =>
                      formik.setFieldValue("price", value)
                    }
                  />
                </div>
              </InputWrapper>
            </div>

            <div className={styles.buttonWrapper}>
              <FullButton
                onClick={() => formik.handleSubmit()}
                customStyles={{ width: "100%" }}
                isLoading={isLoading || isMessageCreateLoading}
              >
                {otherUser?.userType === "creator"
                  ? t("conversation.sendFor", { creditAmount: 0.2 })
                  : t("conversation.send")}
              </FullButton>
            </div>
          </div>
        </div>
        <GalleryModal
          open={openGalleryModal}
          setOpen={setOpenGalleryModal}
          setSelectedMedias={setSelectedMedias}
          selectedMedias={selectedMedias}
          multiple={true}
          mediaType={["image", "video"]}
        />
      </>
    </Modal>
  );
};

export default PrivateNudeModal;
