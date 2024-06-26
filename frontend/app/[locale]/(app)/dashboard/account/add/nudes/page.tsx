import React, { FC } from "react";
import ScrollableContainer from "@/components/ScrollableContainer";
import CenterHeader from "@/components/CenterHeader";
import { useTranslations } from "next-intl";
import CreateNude from "@/components/CreateNude";

interface CreateNudePageProps {
  params: {
    nudeId: string;
  };
}

const CreateNudePage: FC<CreateNudePageProps> = ({ params: { nudeId } }) => {
  const t = useTranslations();

  return (
    <ScrollableContainer>
      <CreateNude />
    </ScrollableContainer>
  );
};

export default CreateNudePage;
