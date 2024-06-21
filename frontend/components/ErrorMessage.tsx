"use client";

import React, { FC } from "react";
import styles from "@/styles/ErrorMessage.module.scss";

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: FC<ErrorMessageProps> = ({ message }) => {
  return <div className={styles.container}>{message}</div>;
};

export default ErrorMessage;
