"use client";

import React, { FC, useState } from "react";
import styles from "@/styles/UserSecondaryProfileImage.module.scss";
import S3Image from "./S3Image";
import FullScreenImage from "./FullScreenImage";
import { Media } from "@/types/models/Media";

interface Props {
  image: Media;
}

const UserSecondaryProfileImage: FC<Props> = ({ image }) => {
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <div className={styles.container} onClick={() => setOpenModal(true)}>
        <S3Image
          imageKey={image.posterKey}
          imageAlt={`media`}
          fill={true}
          styles={{
            objectFit: "cover",
          }}
        />
      </div>
      <FullScreenImage open={openModal} setOpen={setOpenModal} image={image} />
    </>
  );
};

export default UserSecondaryProfileImage;
