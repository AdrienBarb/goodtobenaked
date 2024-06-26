import React, { FC } from "react";
import styles from "@/styles/UserAvatar.module.scss";
import { User } from "@/types/models/User";
import { Link } from "@/navigation";

interface UserAvatarProps {
  user: User;
  size: number;
  onClick?: () => void;
}

const UserAvatar: FC<UserAvatarProps> = ({ user, size }) => {
  return (
    <Link href={`/dashboard/community/${user._id}`} prefetch>
      <div
        className={styles.container}
        style={{
          width: size,
          height: size,
          ...(user?.image?.profil && {
            backgroundImage: `url(${
              process.env.NEXT_PUBLIC_CLOUDFRONT_MEDIA + user?.image?.profil
            })`,
          }),
        }}
      ></div>
    </Link>
  );
};

export default UserAvatar;
