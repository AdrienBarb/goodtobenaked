"use client";

import React, { FC } from "react";
import ScrollableContainer from "@/components/ScrollableContainer";
import { useTranslations } from "next-intl";
import AppMessage from "@/components/AppMessage";
import { TwitterShareButton } from "react-share";
import { useSession } from "next-auth/react";
import ClassicButton from "@/components/Buttons/ClassicButton";
import toast from "react-hot-toast";
import { useSearchParams } from "next/navigation";
import Text from "@/components/Text";
import { useRouter } from "@/navigation";

interface Props {
  params: {
    locale: string;
  };
}

const CreateNudeSuccessPage: FC<Props> = ({ params: { locale } }) => {
  const t = useTranslations();
  const { data: session } = useSession();
  const params = useSearchParams();
  const userId = params.get("createdNudeId");
  const router = useRouter();

  const URL = `${process.env.NEXT_PUBLIC_BASE_URL}/${locale}/dashboard/community/gallery/${session?.user?.id}#item-${userId}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(URL);
      toast.success(t("common.linkCopied"));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ScrollableContainer>
      <AppMessage
        title={t("common.yourNudeWasPoster")}
        text={t("common.shareYourNudeToEnjoyYourCommunity")}
      >
        <TwitterShareButton
          url={URL}
          title={t("common.shareTitleNudeSocialMedia")}
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
          {t("common.copyNudeLink")}
        </ClassicButton>
        <Text customStyles={{ color: "white" }}>{t("common.or")}</Text>
        <ClassicButton
          customStyles={{ width: "100%" }}
          onClick={() =>
            router.push(`/dashboard/community/${session?.user?.id}`)
          }
        >
          {t("common.seeMyProfile")}
        </ClassicButton>
      </AppMessage>
    </ScrollableContainer>
  );
};

export default CreateNudeSuccessPage;
