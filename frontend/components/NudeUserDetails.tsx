import React, { FC } from "react";
import styles from "@/styles/NudeUserDetails.module.scss";
import { Nude } from "@/types/models/Nude";
import UserAvatar from "@/components/UserAvatar";
import { Link } from "@/navigation";
import Text from "./Text";

interface Props {
  nude: Nude;
  showAvatar?: boolean;
  truncateAvailable?: boolean;
}

const NudeUserDetails: FC<Props> = ({ nude, showAvatar }) => {
  return (
    <div className={styles.container}>
      {showAvatar && nude.user && <UserAvatar user={nude.user} size={56} />}
      <span className={styles.wrapper}>
        {nude.user && (
          <Link href={`/dashboard/community/${nude.user._id}`}>
            <Text weight="bolder">{nude.user.pseudo}</Text>
          </Link>
        )}
        <Text customStyles={{ marginTop: "0.2rem" }}>{nude.description}</Text>
      </span>
    </div>
  );
};

export default NudeUserDetails;
