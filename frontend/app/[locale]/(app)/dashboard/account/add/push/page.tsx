import React, { FC } from "react";
import ScrollableContainer from "@/components/ScrollableContainer";
import { useTranslations } from "next-intl";
import CreatePush from "@/components/CreatePush";

interface CreateNudePageProps {
  params: {
    nudeId: string;
  };
}

const CreateNudePage: FC<CreateNudePageProps> = ({ params: { nudeId } }) => {
  const t = useTranslations();

  return (
    <ScrollableContainer>
      <CreatePush />
    </ScrollableContainer>
  );
};

export default CreateNudePage;
