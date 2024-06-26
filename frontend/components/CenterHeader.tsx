import React, { FC } from "react";
import styles from "@/styles/CenterHeader.module.scss";
import { useTranslations } from "next-intl";
import Text from "./Text";
import Title from "./Title";

interface Props {
  title: string;
  description?: string;
  tag: "h1" | "h2" | "h3" | "h4";
}

const CenterHeader: FC<Props> = ({ title, description, tag = "h1" }) => {
  const t = useTranslations();

  return (
    <div className={styles.container}>
      <Title Tag={tag}>{t(title)}</Title>
      {description && <Text textAlign="center">{t(description)}</Text>}
    </div>
  );
};

export default CenterHeader;
