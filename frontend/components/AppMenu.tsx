"use client";

import React, { FC, useEffect, useRef, useState } from "react";
import styles from "@/styles/AppMenu.module.scss";
import { appRouter } from "@/appRouter";
import { useTranslations } from "next-intl";
import { signOut, useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { usePathname, useRouter } from "@/navigation";
import clsx from "clsx";
import { useMediaQuery } from "@mui/material";
import { screenSizes } from "@/constants/screenSizes";
import Grow from "@mui/material/Grow";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import MenuList from "@mui/material/MenuList";
import ClickAwayListener from "@mui/material/ClickAwayListener";
//@ts-ignore
import { UilUserCircle } from "@iconscout/react-unicons";
//@ts-ignore
import { UilChat } from "@iconscout/react-unicons";
//@ts-ignore
import { UilUsersAlt } from "@iconscout/react-unicons";
//@ts-ignore
import { UilMoneybag } from "@iconscout/react-unicons";
//@ts-ignore
import { UilSignOutAlt } from "@iconscout/react-unicons";
//@ts-ignore
import { UilBell } from "@iconscout/react-unicons";
//@ts-ignore
import { UilSetting } from "@iconscout/react-unicons";
//@ts-ignore
import { UilMoneyWithdrawal } from "@iconscout/react-unicons";
//@ts-ignore
import { UilShield } from "@iconscout/react-unicons";
//@ts-ignore
import { UilLink } from "@iconscout/react-unicons";
//@ts-ignore
import { UilListUl } from "@iconscout/react-unicons";
//@ts-ignore
import { UilCompass } from "@iconscout/react-unicons";
import { RootStateType, useAppDispatch } from "@/store/store";
import { getUnreadNotificationsCount } from "@/features/notification/notificationSlice";
import { useSelector } from "react-redux";
import { checkIfUnreadMessages } from "@/features/conversation/conversationSlice";

interface Props {
  setOpenDrawer?: (e: boolean) => void;
}

const AppMenu: FC<Props> = ({ setOpenDrawer }) => {
  const t = useTranslations();
  const { data: session } = useSession();
  const router = useRouter();
  const path = usePathname();
  const dispatch = useAppDispatch();
  const notificationState = useSelector(
    (state: RootStateType) => state.notification
  );
  const conversationState = useSelector(
    (state: RootStateType) => state.conversation
  );

  const [open, setOpen] = useState<boolean>(false);

  const matches = useMediaQuery(`(max-width:${screenSizes.md}px)`);

  const anchorRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    dispatch(getUnreadNotificationsCount());
    dispatch(checkIfUnreadMessages());
  }, []);

  const logout = () => {
    toast.success(t("success.logout"));
    signOut({
      redirect: true,
      callbackUrl: `${process?.env?.NEXT_PUBLIC_INTERNAL_API_URL}/`,
    });
  };

  const isLinkSelected = (linkPath?: string) => path === linkPath;

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <div className={styles.container}>
      <div className={styles.topLinks}>
        <button
          className={clsx(
            styles.card,
            path === appRouter.feed && styles.isSelected
          )}
          onClick={() => {
            handleNavigation(appRouter.feed);
            if (setOpenDrawer) {
              setOpenDrawer(false);
            }
          }}
        >
          <div className={styles.leftWrapper}>
            <UilListUl />
            {t("navigation.feed")}
          </div>
        </button>
        <button
          className={clsx(
            styles.card,
            path === appRouter.explore && styles.isSelected
          )}
          onClick={() => {
            handleNavigation(appRouter.explore);
            if (setOpenDrawer) {
              setOpenDrawer(false);
            }
          }}
        >
          <div className={styles.leftWrapper}>
            <UilCompass />
            {t("navigation.explore")}
          </div>
        </button>
        <button
          className={clsx(
            styles.card,
            path === appRouter.community && styles.isSelected
          )}
          onClick={() => {
            handleNavigation(appRouter.community);
            if (setOpenDrawer) {
              setOpenDrawer(false);
            }
          }}
        >
          <div className={styles.leftWrapper}>
            <UilUsersAlt />
            {t("navigation.community")}
          </div>
        </button>
        <button
          className={clsx(
            styles.card,
            path.includes(appRouter.messages) && styles.isSelected
          )}
          onClick={() => {
            handleNavigation(appRouter.messages);
            if (setOpenDrawer) {
              setOpenDrawer(false);
            }
          }}
        >
          <div className={styles.leftWrapper}>
            <UilChat />
            {t("navigation.message")}
          </div>
          {conversationState.isUnreadMessages && (
            <div
              className={styles.notificationDot}
              style={{
                backgroundColor: isLinkSelected(appRouter.notifications)
                  ? "white"
                  : "#cecaff",
              }}
            ></div>
          )}
        </button>
        <button
          className={clsx(
            styles.card,
            path === appRouter.notifications && styles.isSelected
          )}
          onClick={() => {
            handleNavigation(appRouter.notifications);
            if (setOpenDrawer) {
              setOpenDrawer(false);
            }
          }}
        >
          <div className={styles.leftWrapper}>
            <UilBell />
            {t("navigation.notification")}
          </div>
          {notificationState.unreadNotifications && (
            <div
              className={styles.notificationDot}
              style={{
                backgroundColor: isLinkSelected(appRouter.notifications)
                  ? "white"
                  : "#cecaff",
              }}
            ></div>
          )}
        </button>

        {session?.user?.userType === "creator" && (
          <button
            className={clsx(
              styles.card,
              path.includes(appRouter.incomes) && styles.isSelected
            )}
            onClick={() => {
              handleNavigation(appRouter.incomes);
              if (setOpenDrawer) {
                setOpenDrawer(false);
              }
            }}
          >
            <div className={styles.leftWrapper}>
              <UilMoneyWithdrawal />
              {t("navigation.incomes")}
            </div>
          </button>
        )}
      </div>

      <div className={styles.bottomLinks}>
        <div className={styles.subMenuWrapper}>
          <button
            ref={anchorRef}
            id="composition-button"
            className={clsx(styles.card)}
            aria-haspopup="true"
            onClick={() => setOpen(true)}
          >
            <div className={styles.leftWrapper}>
              <UilUserCircle />
              {session?.user?.pseudo}
            </div>
          </button>
          <Popper
            open={open}
            anchorEl={anchorRef.current}
            role={undefined}
            placement={matches ? "auto-start" : "right-start"}
            transition
            disablePortal
            sx={{
              zIndex: "100",
              width: "220px",
              margin: matches
                ? "0 0 0.4rem 0 !important"
                : "0 0 0 0.4rem !important",
              padding: "0.6rem",
              backgroundColor: "#fff0eb",
              borderRadius: "6px",
              border: "1px solid rgba(0, 0, 0, 0.1)",
            }}
          >
            {({ TransitionProps, placement }) => (
              <Grow {...TransitionProps}>
                <Paper
                  sx={{
                    boxShadow: "none",
                    minWidth: "inherit !important",
                    width: "auto !important",
                  }}
                >
                  <ClickAwayListener onClickAway={() => setOpen(false)}>
                    <MenuList
                      autoFocusItem={open}
                      id="composition-menu"
                      aria-labelledby="composition-button"
                      sx={{
                        padding: "0",
                        backgroundColor: "#fff0eb",
                        border: "none",
                        boxShadow: "none",
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.4rem",
                      }}
                    >
                      <button
                        className={clsx(
                          styles.card,
                          path ===
                            `${appRouter.community}/${session?.user?.id}` &&
                            styles.isSelected
                        )}
                        onClick={() => {
                          handleNavigation(
                            `/dashboard/community/${session?.user?.id}`
                          );
                          setOpen(false);
                          if (setOpenDrawer) {
                            setOpenDrawer(false);
                          }
                        }}
                      >
                        <div className={styles.leftWrapper}>
                          <UilUserCircle />
                          {t("navigation.profile")}
                        </div>
                      </button>
                      <button
                        className={clsx(
                          styles.card,
                          path.includes(appRouter.becomeCreator) &&
                            styles.isSelected
                        )}
                        onClick={() => {
                          handleNavigation(appRouter.becomeCreator);
                          setOpen(false);
                          if (setOpenDrawer) {
                            setOpenDrawer(false);
                          }
                        }}
                      >
                        <div className={styles.leftWrapper}>
                          <UilMoneybag />
                          {t("navigation.becomeCreator")}
                        </div>
                      </button>
                      {/* <button
                        className={clsx(
                          styles.card,
                          path === appRouter.referral && styles.isSelected
                        )}
                        onClick={() => {
                          handleNavigation(appRouter.referral);
                          setOpen(false);
                          if (setOpenDrawer) {
                            setOpenDrawer(false);
                          }
                        }}
                      >
                        <div className={styles.leftWrapper}>
                          <UilLink />
                          {t("navigation.referral")}
                        </div>
                      </button> */}
                      <button
                        className={clsx(
                          styles.card,
                          path.includes(appRouter.parameters) &&
                            styles.isSelected
                        )}
                        onClick={() => {
                          handleNavigation(appRouter.parameters);
                          setOpen(false);
                          if (setOpenDrawer) {
                            setOpenDrawer(false);
                          }
                        }}
                      >
                        <div className={styles.leftWrapper}>
                          <UilSetting />
                          {t("navigation.parameter")}
                        </div>
                      </button>
                      <button
                        className={clsx(styles.card)}
                        onClick={() => {
                          logout();
                          setOpen(false);
                          if (setOpenDrawer) {
                            setOpenDrawer(false);
                          }
                        }}
                      >
                        <div className={styles.leftWrapper}>
                          <UilSignOutAlt />
                          {t("navigation.logout")}
                        </div>
                      </button>
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
        </div>
      </div>
    </div>
  );
};

export default AppMenu;
