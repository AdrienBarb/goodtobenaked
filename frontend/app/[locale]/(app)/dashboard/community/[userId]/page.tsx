import nudeService from "@/features/nude/nudeService";
import React from "react";
import NudesWall from "@/components/NudesWall";
import { Metadata } from "next";
import userService from "@/features/user/userService";
import { genPageMetadata } from "@/app/seo";

export async function generateMetadata({
  params: { userId },
}: {
  params: { userId: string };
}): Promise<Metadata | undefined> {
  const initialUserDatas = await userService.getUser(userId);

  return genPageMetadata({
    title: initialUserDatas?.pseudo,
    description: initialUserDatas?.description,
    image:
      process.env.NEXT_PUBLIC_CLOUDFRONT_MEDIA + initialUserDatas.profileImage,
  });
}

const UserPage = async ({ params }: { params: { userId: string } }) => {
  const { userId } = params;

  if (userId === "index.js.map") {
    return;
  }

  const { nudes, availableFilters } = await nudeService.getUserNudes(userId);

  return (
    <NudesWall
      nudes={nudes}
      initialAvailableFilters={availableFilters}
      userId={userId}
    />
  );
};

export default UserPage;
