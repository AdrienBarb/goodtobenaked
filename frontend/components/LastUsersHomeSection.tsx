import React, { FC } from "react";
import styles from "@/styles/ListHomeSection.module.scss";
import UserCard from "@/components/UserCard";
import FullButton from "./Buttons/FullButton";
import { useTranslations } from "next-intl";
import { User } from "@/types/models/User";

interface Props {
  users: User[];
}

const LastUsersHomeSection: FC<Props> = ({ users }) => {
  const t = useTranslations();

  return (
    <section className={styles.container}>
      <div className={styles.list}>
        {users.length > 0 &&
          users.map((currentUser, index) => {
            return <UserCard key={index} index={index} user={currentUser} />;
          })}
      </div>
      <FullButton href={"/login"} dataId="see-more-users-btn">
        {t("common.seeMore")}
      </FullButton>
    </section>
  );
};

export default LastUsersHomeSection;
