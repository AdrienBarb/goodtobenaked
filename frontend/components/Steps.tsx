import React, { FC } from "react";
import styles from "@/styles/Steps.module.scss";
import Step from "./Step";

interface Props {
  step: number;
}

const Steps: FC<Props> = ({ step }) => {
  return (
    <div className={styles.container}>
      <Step complete={step === 1 || step === 2 || step === 3 || step === 4}>
        1
      </Step>
      <div
        className={styles.line}
        style={{
          backgroundColor:
            step === 2 || step === 3 || step === 4 ? "#ff7195" : "black",
        }}
      ></div>
      <Step complete={step === 2 || step === 3 || step === 4}>2</Step>
      <div
        className={styles.line}
        style={{
          backgroundColor: step === 3 || step === 4 ? "#ff7195" : "black",
        }}
      ></div>
      <Step complete={step === 3 || step === 4}>3</Step>
      <div
        className={styles.line}
        style={{
          backgroundColor: step === 4 ? "#ff7195" : "black",
        }}
      ></div>
      <Step complete={step === 4}>4</Step>
    </div>
  );
};

export default Steps;
