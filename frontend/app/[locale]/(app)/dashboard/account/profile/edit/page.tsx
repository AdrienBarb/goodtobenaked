import BackButton from "@/components/Common/BackButton";
import ScrollableContainer from "@/components/ScrollableContainer";
import categoryService from "@/features/category/categoryService";
import userService from "@/features/user/userService";
import { authOptions } from "@/lib/utils/authOptions";
import { getServerSession } from "next-auth";
import dynamic from "next/dynamic";
import React from "react";

const UserForm = dynamic(() => import("@/components/UserForm"), { ssr: false });

const EditProfilPage = async () => {
  const userInitialDatas = await userService.getAccountOwner();
  const categories = await categoryService.getGenderCategories();
  const session = await getServerSession(authOptions);

  return (
    <ScrollableContainer>
      <BackButton prevPath={`/dashboard/community/${session?.user?.id}`} />
      <UserForm
        initialUserDatas={userInitialDatas}
        genderCategories={categories}
        nextPage={`/dashboard/community/${session?.user?.id}`}
      />
    </ScrollableContainer>
  );
};

export default EditProfilPage;
