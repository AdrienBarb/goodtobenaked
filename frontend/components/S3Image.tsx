import React, { CSSProperties, FC } from "react";
import Image from "next/image";
import { ImageLoader } from "next/image";

interface CustomImageProps {
  imageKey: string;
  imageAlt: string;
  cloudfrontUrl: string | undefined;
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
  cloudfrontUrl,
}) => {
  const myLoader: ImageLoader = ({ src, width, quality }) => {
    return cloudfrontUrl + `${src}?w=${width}&q=${quality || 65}`;
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
        ...styles,
      }}
    />
  );
};

export default S3Image;
