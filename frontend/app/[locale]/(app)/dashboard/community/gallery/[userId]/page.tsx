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

  const initialNudesDatas = await nudeService.getAllNudes({
    userId,
    enablePagination: false,
  });

  return (
    <ScrollableContainer>
      <BackButton prevPath={`/dashboard/community/${userId}`} />
      <NudesGallery initialNudesDatas={initialNudesDatas} />
    </ScrollableContainer>
  );
};

export default UserPage;
