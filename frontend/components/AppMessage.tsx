import React, { FC, ReactNode } from "react";
import styles from "@/styles/AppMessage.module.scss";
import Title from "./Title";
import Text from "./Text";
import Image from "next/image";

interface AppMessageProps {
  title: string;
  text: string;
  children?: ReactNode;
}

const AppMessage: FC<AppMessageProps> = ({ title, text, children }) => {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.image}>
          <Image
            src={"/images/svg/pink.svg"}
            alt="logo"
            fill={true}
            objectFit="contain"
          />
        </div>
        <Title Tag="h3" customStyles={{}}>
          {title}
        </Title>
        <Text customStyles={{ color: "white" }} textAlign="center">
          {text}
        </Text>
        {children && <div className={styles.content}>{children}</div>}
      </div>
    </div>
  );
};

export default AppMessage;
