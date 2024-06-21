import nudeService from "@/features/nude/nudeService";
import { redirect } from "@/navigation";
import { getServerSession } from "next-auth";
import React from "react";
import NudesExplore from "@/components/NudesExplore";
import ScrollableContainer from "@/components/ScrollableContainer";
import { authOptions } from "@/lib/utils/authOptions";

const FeedPage = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const initialNudesDatas = await nudeService.getAllNudes({});

  return (
    <ScrollableContainer>
      <NudesExplore initialNudesDatas={initialNudesDatas} />
    </ScrollableContainer>
  );
};

export default FeedPage;
