import React, { FC } from "react";
import { Nude } from "@/types/models/Nude";
import useCanView from "@/lib/hooks/useCanView";
import S3Image from "./S3Image";
import ReactPlayer from "react-player";

interface Props {
  nude: Nude;
  currentMediaIndex: number;
  type: "fullScreen" | "card";
}

const DisplayedMedia: FC<Props> = ({ nude, currentMediaIndex, type }) => {
  const canView = useCanView(nude);
  const firstMedia = nude.medias[0];
  const currentMedia = nude.medias[currentMediaIndex];

  console.log("firstMedia ", currentMedia.convertedKey);

  if (!canView) {
    return (
      <S3Image
        imageKey={firstMedia.blurredKey}
        imageAlt={`media`}
        fill={true}
        styles={{
          objectFit: "cover",
        }}
      />
    );
  }

  if (type === "card") {
    return (
      <S3Image
        imageKey={currentMedia.posterKey}
        imageAlt={`media`}
        fill={true}
        styles={{
          objectFit: "cover",
        }}
      />
    );
  }

  if (currentMedia.mediaType === "image") {
    return (
      <S3Image
        imageKey={currentMedia.convertedKey}
        imageAlt={`media`}
        fill={true}
        styles={{
          objectFit: "cover",
        }}
      />
    );
  }

  if (currentMedia.mediaType === "video") {
    return (
      <ReactPlayer
        url={currentMedia.convertedKey}
        width={"100%"}
        height={"100%"}
        style={{
          backgroundColor: "black",
          borderRadius: "6px",
        }}
        controls
        auto
      />
    );
  }
};

export default DisplayedMedia;
