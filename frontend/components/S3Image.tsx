import React, { CSSProperties, FC } from "react";
import Image from "next/image";
import { ImageLoader } from "next/image";

interface CustomImageProps {
  imageKey: string;
  imageAlt: string;
  styles?: CSSProperties;
  fill?: boolean;
  width?: number | undefined;
  height?: number | undefined;
}

const S3Image: FC<CustomImageProps> = ({
  imageKey,
  imageAlt,
  styles,
  fill = true,
  width,
  height,
}) => {
  const myLoader: ImageLoader = ({ src }) => {
    return src;
  };

  if (!imageKey) {
    return;
  }

  return (
    <Image
      loader={myLoader}
      src={imageKey}
      alt={imageAlt}
      width={width}
      height={height}
      fill={fill}
      placeholder="blur"
      quality={65}
      blurDataURL={imageKey}
      priority
      style={{
        borderRadius: "6px",
        backgroundColor: "#cecaff",
        ...styles,
      }}
    />
  );
};

export default S3Image;
