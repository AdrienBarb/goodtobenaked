"use client";

import React from "react";
import AccountVerification from "@/components/AccountVerification";
import CenterHeader from "@/components/CenterHeader";
import { useTranslations } from "next-intl";
import PaddingContainer from "@/components/PaddingContainer";
import { useSession } from "next-auth/react";
import AppMessage from "@/components/AppMessage";
import { TwitterShareButton } from "react-share";
import ClassicButton from "@/components/Buttons/ClassicButton";
import toast from "react-hot-toast";
import { useParams } from "next/navigation";
import useApi from "@/lib/hooks/useApi";

const VerificationPage = () => {
  const t = useTranslations();
  const { data: session, update } = useSession();
  const { locale } = useParams();

  const URL = `${process.env.NEXT_PUBLIC_BASE_URL}/${locale}/dashboard/community/${session?.user?.id}`;
  const { usePut } = useApi();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(URL);
      toast.success(t("common.linkCopied"));
    } catch (error) {
      console.error(error);
    }
  };

  const { mutate: editUserType, isLoading } = usePut(`/api/users/user-type`, {
    onSuccess: ({ userType }) => {
      if (session) {
        const updatedSession = {
          ...session,
          user: {
            ...session.user,
            userType,
          },
        };

        update(updatedSession);
      }
    },
  });

  if (session?.user?.userType === "member") {
    return (
      <PaddingContainer>
        <AppMessage
          title={t("common.wantBecomeACreator?")}
          text={t("common.clicOnButton")}
        >
          <ClassicButton
            customStyles={{ width: "100%" }}
            onClick={() => editUserType({ userType: "creator" })}
            isLoading={isLoading}
          >
            {t("common.becomingCreator")}
          </ClassicButton>
        </AppMessage>
      </PaddingContainer>
    );
  }

  if (session?.user?.isAccountVerified) {
    return (
      <PaddingContainer>
        <AppMessage
          title={t("common.yourProfileIsVerified")}
          text={t("common.yourCanNowShareYourProfile")}
        >
          <TwitterShareButton
            url={URL}
            title={t("profile.shareTitleSocialMedia")}
            style={{ width: "100%" }}
          >
            <ClassicButton customStyles={{ width: "100%" }}>
              {t("common.shareOnTwitter")}
            </ClassicButton>
          </TwitterShareButton>
          <ClassicButton
            customStyles={{ width: "100%" }}
            onClick={copyToClipboard}
          >
            {t("common.copyLink")}
          </ClassicButton>
        </AppMessage>
      </PaddingContainer>
    );
  }

  return (
    <PaddingContainer>
      <CenterHeader
        tag="h2"
        title={t("common.becomeCreator")}
        description={t("common.accountVerificationExplanation")}
      />
      <AccountVerification />
    </PaddingContainer>
  );
};

export default VerificationPage;
