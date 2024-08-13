import nudeService from "@/features/nude/nudeService";
import React from "react";
import NudesWall from "@/components/NudesWall";

const UserPage = async ({ params }: { params: { userId: string } }) => {
  const { userId } = params;

  if (userId === "index.js.map") {
    return;
  }

  const initialNudesDatas = await nudeService.getAllNudes({ userId });

  return <NudesWall initialNudesDatas={initialNudesDatas} userId={userId} />;
};

export default UserPage;
