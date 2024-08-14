import React, { FC } from "react";

import MediasGallery from "@/components/MediasGallery";
import { Media } from "@/types/models/Media";
import { useTranslations } from "next-intl";
import { Modal } from "@mui/material";
import ModalHeader from "./ModalHeader";
import styles from "@/styles/GalleryModal.module.scss";
import FullButton from "./Buttons/FullButton";

interface GalleryModalProps {
  setOpen: (e: boolean) => void;
  open: boolean;
  setSelectedMedias: (medias: Media[]) => void;
  selectedMedias: Media[];
  multiple: boolean;
  mediaType: string[];
}

const GalleryModal: FC<GalleryModalProps> = ({
  setOpen,
  open,
  setSelectedMedias,
  selectedMedias,
  multiple,
  mediaType,
}) => {
  //traduction
  const t = useTranslations();

  const handleClickOnSelect = () => {
    setOpen(false);
  };

  return (
    <Modal open={open} onClose={setOpen}>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <ModalHeader
            withCloseIcon={true}
            onClose={setOpen}
            title={t("common.gallery")}
          />
          <MediasGallery
            setSelectedMedias={setSelectedMedias}
            selectedMedias={selectedMedias}
            setOpen={setOpen}
            multiple={multiple}
            mediaType={mediaType}
          />
          <div className={styles.buttonWrapper}>
            <FullButton
              onClick={handleClickOnSelect}
              disabled={selectedMedias.length === 0}
              customStyles={{ width: "100%" }}
            >
              {selectedMedias.length
                ? `${t("common.select")} (${selectedMedias.length})`
                : t("common.select")}
            </FullButton>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default GalleryModal;
