import ContainerWithBackArrow from "@/components/ContainerWithBackArrow";
import PaddingContainer from "@/components/PaddingContainer";
import categoryService from "@/features/category/categoryService";
import userService from "@/features/user/userService";
import dynamic from "next/dynamic";
import React from "react";

const UserForm = dynamic(() => import("@/components/UserForm"), { ssr: false });

const EditProfilPage = async () => {
  const userInitialDatas = await userService.getAccountOwner();
  const categories = await categoryService.getGenderCategories();

  return (
    <>
      <ContainerWithBackArrow prevPath="/dashboard/account/become-creator" />

      <PaddingContainer>
        <UserForm
          initialUserDatas={userInitialDatas}
          genderCategories={categories}
          nextPage={"/dashboard/account/become-creator"}
        />
      </PaddingContainer>
    </>
  );
};

export default EditProfilPage;
