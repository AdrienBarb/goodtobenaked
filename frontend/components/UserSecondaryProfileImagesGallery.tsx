"use client";

import React, { FC, useEffect, useState } from "react";
import styles from "@/styles/UserSecondaryProfileImageGallery.module.scss";
import S3Image from "./S3Image";
import { Media } from "@/types/models/Media";
import { useParams } from "next/navigation";
import useApi from "@/lib/hooks/useApi";
import UserSecondaryProfileImage from "./UserSecondaryProfileImage";

interface Props {
  images: Media[];
}

const UserSecondaryProfileImageGallery: FC<Props> = ({ images }) => {
  const { userId } = useParams();

  const { fetchData } = useApi();

  const [userImages, setUserImages] = useState(images);

  const getUserImages = async () => {
    try {
      const r = await fetchData(`/api/users/${userId}`);

      setUserImages(r.secondaryProfileImages);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (userId) {
      getUserImages();
    }
  }, [userId]);

  if (images.length === 0) {
    return <></>;
  }

  return (
    <div className={styles.container}>
      {userImages.map((image: Media, index: number) => {
        if (!image.posterKey) {
          return;
        }

        return <UserSecondaryProfileImage key={index} image={image} />;
      })}
    </div>
  );
};

export default UserSecondaryProfileImageGallery;
