import React, { FC } from "react";
import styles from "@/styles/BlurMedia.module.scss";
import Image from "next/image";
import Text from "./Text";
import { useTranslations } from "next-intl";

interface Props {}

const BlurMedia: FC<Props> = ({}) => {
  const t = useTranslations();

  return (
    <div className={styles.container}>
      <div className={styles.payIcon}>
        <Image
          src={"/images/svg/white.svg"}
          alt="logo"
          fill={true}
          objectFit="contain"
        />
      </div>
      <Text
        weight="thiner"
        textAlign="center"
        customStyles={{ color: "white" }}
        fontSize={12}
      >
        {t("common.wantToSeeMore")}
      </Text>
    </div>
  );
};

export default BlurMedia;
