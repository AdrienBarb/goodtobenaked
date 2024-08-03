import React, { FC, useEffect, useState } from "react";
import styles from "@/styles/GalleryCard.module.scss";
import clsx from "clsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faImage,
  faTrash,
  faVideo,
} from "@fortawesome/free-solid-svg-icons";
import { Media } from "@/types/models/Media";
import { useTranslations } from "next-intl";
import ConfirmationModal from "./ConfirmationModal";
import S3Image from "./S3Image";
import Loader from "./Loader";
import Text from "./Text";

interface GalleryCardProps {
  media: Media;
  handleSelectMedia?: (media: Media) => void;
  deleteAction: (e?: string) => void;
  isSelected?: Boolean;
  shouldConfirmBeforeDelete?: boolean;
}

const GalleryCard: FC<GalleryCardProps> = ({
  handleSelectMedia,
  media,
  deleteAction,
  isSelected,
  shouldConfirmBeforeDelete,
}) => {
  //localstate
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);

  // traduction
  const t = useTranslations();

  const handleClickOnDelete = (event: React.MouseEvent<HTMLDivElement>) => {
    if (shouldConfirmBeforeDelete) {
      event.stopPropagation();
      setOpenConfirmationModal(true);
      return;
    }

    deleteAction(media._id);
  };

  const handleDeleteConfirmation = () => {
    deleteAction(media._id);
  };

  if (media.status === "created") {
    return (
      <>
        <div className={clsx(styles.card, styles.loadingCard)}>
          <div
            onClick={(event) => handleClickOnDelete(event)}
            className={styles.deleteButton}
          >
            <FontAwesomeIcon icon={faTrash} size="lg" />
          </div>
          <Loader style={{ color: "white", marginBottom: "1rem" }} size={16} />
          <Text
            weight="bolder"
            textAlign="center"
            customStyles={{ color: "white" }}
            fontSize={10}
          >
            {t("common.weAreFormattingYourMedia")}
          </Text>
        </div>
        <ConfirmationModal
          setOpen={setOpenConfirmationModal}
          open={openConfirmationModal}
          confirmAction={handleDeleteConfirmation}
          text={t("error.sureDeleteThisMedia")}
        />
      </>
    );
  }

  return (
    <>
      <div
        className={styles.card}
        style={{ cursor: handleSelectMedia ? "pointer" : "inherit" }}
        onClick={() => {
          if (handleSelectMedia) {
            handleSelectMedia(media);
          }
        }}
      >
        {handleSelectMedia && (
          <div
            className={clsx(styles.selecter, isSelected && styles.isSelected)}
          >
            {isSelected && <FontAwesomeIcon icon={faCheck} />}
          </div>
        )}

        <div
          onClick={(event) => handleClickOnDelete(event)}
          className={styles.deleteButton}
        >
          <FontAwesomeIcon icon={faTrash} size="lg" />
        </div>
        <div className={styles.mediaTypeIcon}>
          {media.mediaType === "image" ? (
            <FontAwesomeIcon icon={faImage} size="xs" color="white" />
          ) : (
            <FontAwesomeIcon icon={faVideo} size="xs" color="white" />
          )}
        </div>
        {media.posterKey && (
          <S3Image
            imageKey={media.posterKey}
            imageAlt={`media`}
            fill={true}
            styles={{
              objectFit: "cover",
            }}
          />
        )}
      </div>

      <ConfirmationModal
        setOpen={setOpenConfirmationModal}
        open={openConfirmationModal}
        confirmAction={handleDeleteConfirmation}
        text={t("error.sureDeleteThisMedia")}
      />
    </>
  );
};

export default GalleryCard;
