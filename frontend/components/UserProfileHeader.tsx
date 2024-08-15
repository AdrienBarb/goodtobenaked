"use client";

import React, { FC, useState } from "react";
import styles from "@/styles/Profile.module.scss";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import TimeAgo from "javascript-time-ago";
import fr from "javascript-time-ago/locale/fr";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faCircle, faStar } from "@fortawesome/free-solid-svg-icons";
import { RootStateType } from "@/store/store";
import parser from "html-react-parser";
import ProfileIcon from "@/components/ProfileIcon";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { User } from "@/types/models/User";
import useApi from "@/lib/hooks/useApi";
import UserProfileButtons from "./UserProfileButtons";
import Title from "./Title";
import Text from "./Text";

//Config timeago in french
TimeAgo.addDefaultLocale(fr);

interface Props {
  initialUserDatas: User;
}

const UserProfileHeader: FC<Props> = ({ initialUserDatas }) => {
  const socketState = useSelector((state: RootStateType) => state.socket);
  const [currentUser, setCurrentUser] = useState(initialUserDatas);

  //router
  const { userId } = useParams<{ userId: string }>();

  //session
  const { data: session } = useSession();

  //traduction
  const t = useTranslations();

  //others
  const timeAgo = new TimeAgo("fr-FR");

  const { useGet } = useApi();

  useGet(
    `/api/users/${userId}`,
    {},
    {
      initialData: initialUserDatas,
      onSuccess: (data) => {
        setCurrentUser(data);
      },
    }
  );

  const dateObject = moment(currentUser?.lastLogin).toDate();
  const timeAgoValue = timeAgo.format(dateObject);

  return (
    <div className={styles.container}>
      <div
        className={styles.imageWrapper}
        style={{
          ...(currentUser.profileImage && {
            backgroundImage: `url(${
              process.env.NEXT_PUBLIC_CLOUDFRONT_MEDIA +
              currentUser.profileImage
            })`,
          }),
        }}
      ></div>

      <div className={styles.detailsWrapper}>
        <div className={styles.pseudoContainer}>
          <div className={styles.pseudoWrapper}>
            {currentUser && currentUser.verified === "verified" && (
              <ProfileIcon
                icon={faCheck}
                popoverDescription={t("profile.verifiedProfile")}
              />
            )}
            <Title Tag="h2" titleStyle={{ margin: "0" }}>
              {currentUser.pseudo}
            </Title>
          </div>
        </div>
        <Text
          customStyles={{ whiteSpace: "pre-line", marginTop: "0.6rem" }}
          textAlign="center"
        >
          {currentUser.version === 1
            ? parser(currentUser.description ?? "")
            : currentUser.description}
        </Text>
        {!session && (
          <div className={styles.status}>
            {socketState.onlineUsers?.some(
              (u) => u?.userId === currentUser?._id
            ) ? (
              <div className={styles.statusWraper}>
                <div className={styles.iconWrapper}>
                  <FontAwesomeIcon icon={faCircle} color="#57cc99" size="xs" />
                </div>
                {t("profile.online")}
              </div>
            ) : (
              <div>{`${t("profile.online")} : ${timeAgoValue}`}</div>
            )}
          </div>
        )}
        <UserProfileButtons
          currentUser={currentUser}
          setCurrentUser={setCurrentUser}
        />
      </div>
    </div>
  );
};

export default UserProfileHeader;
