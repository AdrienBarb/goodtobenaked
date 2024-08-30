"use client";

import React, { useState } from "react";
import PageContainer from "@/components/PageContainer";
import UserSignUpForm from "@/components/UserSignUpForm";
import styles from "@/styles/AuthPage.module.scss";
import EmptyButton from "@/components/Buttons/EmptyButton";
import { useTranslations } from "next-intl";
import FullButton from "@/components/Buttons/FullButton";
import { useSession } from "next-auth/react";
import useApi from "@/lib/hooks/useApi";
import { useRouter } from "@/navigation";
import { appRouter } from "@/appRouter";

const SignUpPage = () => {
  const t = useTranslations();
  const [userType, setUserType] = useState("");
  const { data: session, update } = useSession();

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
        userType === "member"
          ? router.push(appRouter.preferences)
          : router.push(appRouter.feed);
      }
    },
  });

  return (
    <PageContainer>
      <div className="max-w-lg mx-auto">
        <h2 className="font-rubik text-xl font-semibold mb-16 mx-auto w-full text-center">
          {t("common.whatKindOfUser")}
        </h2>

        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 mb-12">
          <div
            onClick={() => setUserType("creator")}
            className={`flex flex-col w-full lg:w-fit border border-neutral-200 rounded-md p-8 text-center cursor-pointer hover:border-primary-light hover:bg-primary-light ${
              userType === "creator" ? "bg-primary border-primary" : ""
            }`}
          >
            <h3 className="font-karla font-medium text-lg">
              {t("common.creator")}
            </h3>
            <p>{t("common.creatorTypeText")}</p>
          </div>

          <div
            onClick={() => setUserType("member")}
            className={`flex flex-col w-full lg:w-fit border border-neutral-200 rounded-md p-8 text-center cursor-pointer hover:border-primary-light hover:bg-primary-light ${
              userType === "member" && "bg-primary border-primary"
            }`}
          >
            <h3 className="font-karla font-medium text-lg">
              {t("common.buyer")}
            </h3>
            <p>{t("common.buyerTypeText")}</p>
          </div>
        </div>

        <FullButton
          customStyles={{ width: "100%" }}
          disabled={!userType}
          isLoading={isLoading}
          onClick={() => {
            editUserType({ userType });
          }}
        >
          {t("common.continue")}
        </FullButton>
      </div>
    </PageContainer>
  );
};

export default SignUpPage;
