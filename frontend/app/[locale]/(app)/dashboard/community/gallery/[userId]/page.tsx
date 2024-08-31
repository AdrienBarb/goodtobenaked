import nudeService from "@/features/nude/nudeService";
import React from "react";
import NudesGallery from "@/components/NudesGallery";
import ScrollableContainer from "@/components/ScrollableContainer";
import BackButton from "@/components/Common/BackButton";

const UserPage = async ({ params }: { params: { userId: string } }) => {
  const { userId } = params;

  if (userId === "index.js.map") {
    return;
  }

  const { nudes } = await nudeService.getUserNudes(userId);

  return (
    <ScrollableContainer>
      <BackButton prevPath={`/dashboard/community/${userId}`} />
      <NudesGallery nudes={nudes} />
    </ScrollableContainer>
  );
};

export default UserPage;
