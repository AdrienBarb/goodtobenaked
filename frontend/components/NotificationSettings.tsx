"use client";

import React, { useEffect, useState, ChangeEvent } from "react";
import styles from "@/styles/UserSettings.module.scss";
import { Divider, Switch } from "@mui/material";
import { USER_INAPP_NOTIFICATION, Notification } from "@/constants/constants";
import { useTranslations } from "next-intl";
import SettingSectionHeader from "./SettingSectionHeader";
import useApi from "@/lib/hooks/useApi";
import { User } from "@/types/models/User";

const NotificationSettings = () => {
  //traduction
  const t = useTranslations();

  //localstate
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const { fetchData, usePut } = useApi();

  const getCurrentOwner = async () => {
    try {
      const r = await fetchData(`/api/users/owner`);

      setCurrentUser(r);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCurrentOwner();
  }, []);

  const { mutate: editEmailNotification } = usePut(
    "/api/users/email-notification",
    {
      onSuccess: ({ emailNotification }) => {
        if (currentUser) {
          setCurrentUser({
            ...currentUser,
            emailNotification: emailNotification,
          });
        }
      },
    }
  );

  const { mutate: editInappNotification } = usePut(
    "/api/users/inapp-notification",
    {
      onSuccess: ({ inappNotification }) => {
        if (currentUser) {
          setCurrentUser({
            ...currentUser,
            inappNotification: inappNotification,
          });
        }
      },
    }
  );

  const handleEmailNotificationChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    editEmailNotification({ emailNotification: event.target.checked });
  };

  const handleInappNotificationChange = (notificationType: Notification) => {
    editInappNotification({
      notificationType: notificationType,
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.flex}>
        <SettingSectionHeader
          title={t("settings.email_notification")}
          type="main"
        />
        <Switch
          name="emailNotification"
          checked={currentUser?.emailNotification || false}
          onChange={(e) => handleEmailNotificationChange(e)}
          sx={{
            color: "#Cecaff !important",
            ".Mui-checked": {
              color: "#Cecaff !important",
            },
            ".MuiSwitch-track": {
              backgroundColor: "#Cecaff !important",
            },
          }}
        />
      </div>
      <Divider sx={{ my: 2 }} />
      <SettingSectionHeader
        title={t("settings.inapp_notification")}
        subTitle={t("settings.inapp_notification_description")}
        type="main"
      />
      <div className={styles.carrierContainer}>
        {USER_INAPP_NOTIFICATION.map(
          (currentNotification: Notification, index: number) => {
            return (
              <>
                <div className={styles.flex} key={index}>
                  <div className={styles.left}>
                    <div className={styles.subLabel}>
                      {t(`settings.${currentNotification}`)}
                    </div>
                  </div>
                  <Switch
                    checked={
                      Boolean(
                        currentUser?.inappNotification?.includes(
                          currentNotification
                        )
                      ) || false
                    }
                    onChange={(e) =>
                      handleInappNotificationChange(currentNotification)
                    }
                    sx={{
                      color: "#Cecaff !important",
                      ".Mui-checked": {
                        color: "#Cecaff !important",
                      },
                      ".MuiSwitch-track": {
                        backgroundColor: "#Cecaff !important",
                      },
                    }}
                  />
                </div>
                <Divider sx={{ my: 2 }} />
              </>
            );
          }
        )}
      </div>
    </div>
  );
};

export default NotificationSettings;
