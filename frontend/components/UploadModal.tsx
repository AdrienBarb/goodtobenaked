import React, { FC, useRef, useState } from "react";
import axios from "axios";
import { useTranslations } from "next-intl";
import { Modal } from "@mui/material";
import ModalHeader from "./ModalHeader";
import styles from "@/styles/UploadModal.module.scss";
import mediaService from "@/features/media/mediaService";
import FullButton from "./Buttons/FullButton";
import Dropzone from "react-dropzone";
import Text from "./Text";
import Cropper, { ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";
import toast from "react-hot-toast";
import { Media } from "@/types/models/Media";

interface UploadModalProps {
  setOpen: (e: boolean) => void;
  open: boolean;
  medias: Media[];
  setMedias: (e: Media[]) => void;
}

const UploadModal: FC<UploadModalProps> = ({
  setOpen,
  open,
  setMedias,
  medias,
}) => {
  const t = useTranslations();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [modalContent, setModalContent] = useState<"init" | "crop" | "upload">(
    "init"
  );
  const [progress, setProgress] = useState(0);
  const [croppedImage, setCroppedImage] = useState<string | undefined>();
  const [isUploading, setIsUploading] = useState(false);
  const cropperRef = useRef<ReactCropperElement>(null);

  const handleUpload = async (file: File) => {
    setModalContent("upload");
    setIsUploading(true);

    try {
      const { url, media } = await mediaService.generateUploadUrl({
        filetype: file.type,
      });

      setMedias([media, ...medias]);

      await axios.put(url, file, {
        headers: {
          "Content-Type": file.type,
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress(percentCompleted);
          }
        },
      });

      console.log("File uploaded successfully.");
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setIsUploading(false);
      setSelectedFile(null);
      setOpen(false);
      setModalContent("init");
    }
  };

  const handleFileDrop = (files: File[]) => {
    const file = files[0];
    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");
    const maxSize = isImage ? 10 * 1024 * 1024 : 5000 * 1024 * 1024;

    if (file.size > maxSize) {
      toast.error(
        t("error.fileTooLarge", { maxSize: isImage ? "10 MB" : "5 GB" })
      );
      return;
    }

    setSelectedFile(file);

    if (isImage) {
      const reader = new FileReader();
      reader.onload = () => {
        setCroppedImage(reader.result as string);
        setModalContent("crop");
      };
      reader.readAsDataURL(file);
    } else if (isVideo) {
      handleUpload(file);
    }
  };

  const handleCrop = () => {
    const cropper = cropperRef.current?.cropper;
    if (cropper && selectedFile) {
      const croppedDataURL = cropper.getCroppedCanvas().toDataURL();
      setCroppedImage(croppedDataURL);
      // Converting dataURL to a File object
      const byteString = atob(croppedDataURL.split(",")[1]);
      const mimeString = croppedDataURL
        .split(",")[0]
        .split(":")[1]
        .split(";")[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const newFile = new File([ab], selectedFile.name, { type: mimeString });
      handleUpload(newFile);
    }
  };

  const handleCloseModal = () => {
    if (isUploading) {
      toast.error(t("error.downloadingMedia"));
      return;
    }

    setOpen(false);
    setModalContent("init");
  };

  let modalView = (
    <Dropzone
      onDrop={(files) => handleFileDrop(files)}
      maxFiles={1}
      accept={{
        "image/*": [".png", ".jpg"],
        "video/*": [".mov", ".mp4"],
      }}
    >
      {({ getRootProps, getInputProps }) => (
        <div
          {...getRootProps({
            className: "dropzone",
            style: {
              border: "2px dashed #cecaff",
              padding: "2rem",
              borderRadius: "6px",
              height: "100%",
              textAlign: "center",
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
              gap: "2rem",
              justifyContent: "center",
              cursor: "pointer",
            },
          })}
        >
          <input {...getInputProps()} />
          <Text textAlign="center" weight="bolder">
            {t("common.dropzoneSentence")}
          </Text>
          <Text textAlign="center" weight="bolder">
            {t("common.maxSizeImage")}
          </Text>
        </div>
      )}
    </Dropzone>
  );

  if (modalContent === "crop") {
    modalView = (
      <div className={styles.cropperContainer}>
        <Cropper
          src={croppedImage}
          style={{ height: "400px", background: "black" }}
          initialAspectRatio={4 / 5}
          aspectRatio={4 / 5}
          guides={true}
          ref={cropperRef}
          viewMode={1}
          responsive={true}
          autoCropArea={1}
          checkOrientation={false}
        />
        <FullButton
          onClick={handleCrop}
          customStyles={{ marginTop: "2rem", width: "100%" }}
        >
          {t("common.uploadImage")}
        </FullButton>
      </div>
    );
  }

  if (modalContent === "upload") {
    modalView = (
      <div className={styles.progressWrapper}>
        <Text
          textAlign="center"
          weight="thiner"
          customStyles={{ fontSize: "32px" }}
        >{`${progress}%`}</Text>
        <Text textAlign="center">{t("common.weUploadYourFile")}.</Text>
      </div>
    );
  }

  return (
    <Modal open={open} onClose={handleCloseModal}>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <ModalHeader
            withCloseIcon={true}
            onClose={handleCloseModal}
            title={t("common.importFile")}
            withBackAction={modalContent === "crop"}
            backAction={() => setModalContent("init")}
          />
          <div className={styles.content}>{modalView}</div>
        </div>
      </div>
    </Modal>
  );
};

export default UploadModal;
