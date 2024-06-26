"use client";

import React, { FC, useState } from "react";
import styles from "@/styles/EmailVerification.module.scss";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import CustomTextField from "./Inputs/TextField";
import FullButton from "./Buttons/FullButton";
import useApi from "@/lib/hooks/useApi";
import { useRouter } from "@/navigation";

interface VerificationCodeButtonProps {
  nextPath: string;
}

const VerificationCodeButton: FC<VerificationCodeButtonProps> = ({
  nextPath,
}) => {
  const [code, setCode] = useState("");
  const { data: session, update } = useSession();
  const t = useTranslations();
  const router = useRouter();

  const { usePost } = useApi();

  const { mutate: verifyVerificationCode, isLoading } = usePost(
    `/api/email/verify-code`,
    {
      onSuccess: ({ emailVerified }) => {
        if (session) {
          const updatedSession = {
            ...session,
            user: {
              ...session.user,
              emailVerified: emailVerified,
            },
          };

          update(updatedSession);
          router.push(nextPath);
        }
      },
    }
  );

  const handleCodeChange = (event: any) => {
    setCode(event.target.value);
  };

  const handleVerifyCode = () => {
    if (!code) {
      return;
    }

    verifyVerificationCode({ code });
  };

  return (
    <div className={styles.inputWrapper}>
      <CustomTextField
        variant="standard"
        fullWidth
        label={t("common.verification_code")}
        value={code}
        onChange={handleCodeChange}
      />

      <FullButton
        onClick={handleVerifyCode}
        disabled={!code}
        isLoading={isLoading}
        customStyles={{
          width: "100%",
        }}
      >
        {t("common.confirm_code")}
      </FullButton>
    </div>
  );
};

interface EmailVerificationProps {
  nextPath: string;
}

const EmailVerification: FC<EmailVerificationProps> = ({ nextPath }) => {
  //redux
  const { data: session } = useSession();

  //localstate
  const [isCodeSended, setIsCodeSended] = useState(false);

  const { usePost } = useApi();

  //traduction
  const t = useTranslations();

  const { mutate: sendVerificationCode, isLoading } = usePost(
    `/api/email/send-verification-code`,
    {
      onSuccess: () => {
        setIsCodeSended(true);
      },
    }
  );

  const handleSendCode = async () => {
    sendVerificationCode({});
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {isCodeSended ? (
          <div className={styles.content}>
            <div>
              {t("common.we_send_code", {
                emailAddress: session?.user?.email,
              })}
            </div>
            <VerificationCodeButton nextPath={nextPath} />
            <div>
              {t("common.didnt_receive_code")}{" "}
              <span
                className={styles.resendLink}
                onClick={() => setIsCodeSended(false)}
              >
                {t("common.send_back_code")}
              </span>
            </div>
          </div>
        ) : (
          <div className={styles.content}>
            <div>{t("common.code_explanation")}</div>
            <FullButton
              onClick={handleSendCode}
              isLoading={isLoading}
              customStyles={{
                width: "100%",
              }}
            >
              {t("common.send_code")}
            </FullButton>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailVerification;
