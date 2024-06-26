"use client";

import { Modal } from "@mui/material";
import React, { FC, useState } from "react";
import styles from "@/styles/UserTypeModal.module.scss";
import Image from "next/image";
import Title from "./Title";
import Text from "./Text";
import clsx from "clsx";
import SimpleButton from "./Buttons/SimpleButton";
import useApi from "@/lib/hooks/useApi";
import { useSession } from "next-auth/react";
import { useRouter } from "@/navigation";
import { useTranslations } from "next-intl";

interface Props {
  setOpen: (e: boolean) => void;
  open: boolean;
}

const UserTypeModal: FC<Props> = ({ setOpen, open }) => {
  const [userType, setUserType] = useState("");
  const { data: session, update } = useSession();
  const t = useTranslations();

  const { usePut } = useApi();

  const router = useRouter();

  const { mutate: editUserType, isLoading } = usePut(`/api/users/user-type`, {
    onSuccess: ({ userType }) => {
      if (session) {
        const updatedSession = {
          ...session,
          user: {
            ...session.user,
            userType: userType,
          },
        };

        update(updatedSession);
        setOpen(false);
      }
    },
  });

  return (
    <Modal open={open} onClose={setOpen}>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <div className={styles.title}>{t("common.whatKindOfUser")}</div>

          <div className={styles.cardsWrapper}>
            <div
              className={clsx(
                styles.card,
                userType === "creator" && styles.selected
              )}
              onClick={() => setUserType("creator")}
            >
              <Title Tag="h3" customStyles={{}}>
                {t("common.creator")}
              </Title>
              <Text customStyles={{ color: "white" }} textAlign="center">
                {t("common.creatorTypeText")}
              </Text>
              <div className={styles.image}>
                <Image
                  src={"/images/svg/pink.svg"}
                  alt="logo"
                  fill={true}
                  objectFit="contain"
                />
              </div>
            </div>
            <div
              className={clsx(
                styles.card,
                userType === "member" && styles.selected
              )}
              onClick={() => setUserType("member")}
            >
              <Title Tag="h3" customStyles={{}}>
                {t("common.buyer")}
              </Title>
              <Text customStyles={{ color: "white" }} textAlign="center">
                {t("common.buyerTypeText")}
              </Text>
              <div className={styles.image}>
                <Image
                  src={"/images/svg/green.svg"}
                  alt="logo"
                  fill={true}
                  objectFit="contain"
                />
              </div>
            </div>
          </div>
          <SimpleButton
            disabled={!userType}
            isLoading={isLoading}
            onClick={() => {
              editUserType({ userType });
            }}
          >
            {t("common.continue")}
          </SimpleButton>
        </div>
      </div>
    </Modal>
  );
};

export default UserTypeModal;
