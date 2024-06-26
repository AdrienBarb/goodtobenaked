import React, { FC, ReactNode } from "react";
import styles from "@/styles/PageHeader.module.scss";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import Text from "./Text";
import Title from "./Title";

interface PageHeaderProps {
  title: string;
  description?: string;
  tag: "h1" | "h2" | "h3" | "h4";
  children?: ReactNode;
}

const PageHeader: FC<PageHeaderProps> = ({
  title,
  description,
  tag = "h1",
  children,
}) => {
  const t = useTranslations();

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <div className={clsx(styles.left, children && styles.withChildren)}>
          <Title Tag={tag}>{t(title)}</Title>
          {description && <Text>{t(description)}</Text>}
        </div>
        {children}
      </div>
      <span className={styles.divider}></span>
    </div>
  );
};

export default PageHeader;
