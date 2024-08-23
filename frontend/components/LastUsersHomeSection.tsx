import React, { FC } from "react";
import styles from "@/styles/ListHomeSection.module.scss";
import UserCard from "@/components/UserCard";
import FullButton from "./Buttons/FullButton";
import { useTranslations } from "next-intl";
import { User } from "@/types/models/User";
import LandingHeader from "./LandingHeader";

interface Props {
  users: User[];
}

const LastUsersHomeSection: FC<Props> = ({ users }) => {
  const t = useTranslations();

  return (
    <section className={styles.container}>
      <LandingHeader title={t("home.joinOurLatestCreator")} />
      <div className={styles.list}>
        {users.length > 0 &&
          users.map((currentUser, index) => {
            return <UserCard key={index} index={index} user={currentUser} />;
          })}
      </div>
    </section>
  );
};

export default LastUsersHomeSection;
