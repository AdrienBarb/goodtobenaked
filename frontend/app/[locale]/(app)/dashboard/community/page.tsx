import UsersList from "@/components/UsersList";
import React from "react";
import userService from "@/features/user/userService";
import { getServerSession } from "next-auth";
import { redirect } from "@/navigation";
import ScrollableContainer from "@/components/ScrollableContainer";
import { authOptions } from "@/lib/utils/authOptions";

const UsersPage = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const initialUsersDatas = await userService.getAllUsers();

  return (
    <ScrollableContainer>
      <UsersList initialUsersDatas={initialUsersDatas} />
    </ScrollableContainer>
  );
};

export default UsersPage;
