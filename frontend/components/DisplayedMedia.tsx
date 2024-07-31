import React, { FC } from "react";
import { Nude } from "@/types/models/Nude";
import useCanView from "@/lib/hooks/useCanView";
import S3Image from "./S3Image";
import ReactPlayer from "react-player";
import { Media } from "@/types/models/Media";
import useIsOwner from "@/lib/hooks/useIsOwner";

interface Props {
  nude: Nude;
  currentMediaIndex: number;
  type: "fullScreen" | "card";
}

const DisplayedMedia: FC<Props> = ({ nude, currentMediaIndex, type }) => {
  const canView = useCanView(nude);
  const isOwner = useIsOwner(nude.user._id);
  const firstMedia = nude.medias[0];
  const currentMedia: Media = nude.medias[currentMediaIndex];

  console.log("firstMedia ", currentMedia.convertedKey);

  if (!canView && !isOwner && firstMedia.blurredKey) {
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

  if (type === "card" && currentMedia.posterKey) {
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

  if (currentMedia.mediaType === "image" && currentMedia.convertedKey) {
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
