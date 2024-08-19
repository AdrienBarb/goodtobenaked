"use client";

import React, { useState, FC } from "react";
import styles from "@/styles/UserProfileTopButtons.module.scss";
import { useParams } from "next/navigation";
import { faPen, faShare } from "@fortawesome/free-solid-svg-icons";
import ShareModal from "@/components/ShareModal";
import { useSession } from "next-auth/react";
import { useRouter } from "@/navigation";
import { appRouter } from "@/appRouter";
import IconButton from "./Buttons/IconButton";

interface Props {}

const UserProfileTopButtons: FC<Props> = () => {
  //router
  const router = useRouter();
  const { userId } = useParams<{ userId: string }>();

  //session
  const { data: session } = useSession();

  //localstate
  const [openShareModal, setOpenShareModal] = useState(false);

  const handleEditAccountDetailsClick = () => {
    router.push(appRouter.editProfile);
  };

  return (
    <>
      <div className={styles.buttonsWrapper}>
        {session?.user?.id === userId && (
          <IconButton
            onClick={handleEditAccountDetailsClick}
            icon={faPen}
            dataId="edit-profile-btn"
          />
        )}

        <IconButton
          onClick={() => setOpenShareModal(true)}
          icon={faShare}
          dataId="share-profile-btn"
        />
      </div>

      <ShareModal open={openShareModal} setOpen={setOpenShareModal} />
    </>
  );
};

export default UserProfileTopButtons;
