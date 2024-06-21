import { Media } from "@/types/models/Media";
import React, { FC } from "react";
import styles from "@/styles/MediaDetails.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faVideo } from "@fortawesome/free-solid-svg-icons";

interface MediaDetailsProps {
  medias: Media[];
}

const MediaDetails: FC<MediaDetailsProps> = ({ medias }) => {
  const mediaCount: { image?: number; video?: number } = medias.reduce(
    (acc: any, media: Media) => {
      acc[media.mediaType] = (acc[media.mediaType] || 0) + 1;
      return acc;
    },
    {}
  );

  return (
    <div className={styles.container}>
      {mediaCount.image && (
        <div className={styles.wrapper}>
          {mediaCount.image} <FontAwesomeIcon icon={faImage} size="xs" />
        </div>
      )}
      {mediaCount.video && (
        <div className={styles.wrapper}>
          {mediaCount.video} <FontAwesomeIcon icon={faVideo} size="xs" />
        </div>
      )}
    </div>
  );
};

export default MediaDetails;
