"use client";

import React, { useState } from "react";
import styles from "@/styles/NavigationBar.module.scss";
import Image from "next/image";
import logo from "../../public/images/logo.svg";
import MenuIcon from "@mui/icons-material/Menu";
import useMediaQuery from "@mui/material/useMediaQuery";
import { screenSizes } from "@/constants/screenSizes";
import SimpleButton from "@/components/Buttons/SimpleButton";
import { Link } from "@/navigation";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "../LanguageSwitcher";
import MobileMenu from "../MobileMenu";
import CreditAmount from "../CreditAmount";
import UserAddMenu from "../UserAddMenu";

const NavigationBar = () => {
  //Local state
  const [openMenuDrawer, setOpenMenuDrawer] = useState(false);

  //Others
  const t = useTranslations();
  const matches = useMediaQuery(`(max-width:${screenSizes.md}px)`);
  const { status, data: session } = useSession();

  console.log("session ", session);
  console.log("status ", status);

  return (
    <>
      <div className={styles.navContainer}>
        <div className={styles.navbar}>
          {matches && status === "authenticated" && (
            <div
              onClick={() => setOpenMenuDrawer(true)}
              data-id="mobile-burger-menu"
            >
              <MenuIcon
                sx={{ fontSize: "48", cursor: "pointer", color: "#1C131E" }}
              />
            </div>
          )}
          {!matches ? (
            <Link
              href={status === "authenticated" ? "/dashboard/feed" : "/"}
              passHref
              prefetch
            >
              <div className={styles.logo}>
                <Image
                  src={logo}
                  alt="Logo Goodtobenaked"
                  fill={true}
                  objectFit="contain"
                />
              </div>
            </Link>
          ) : (
            <div></div>
          )}

          <div className={styles.flexWrapper}>
            {status === "unauthenticated" && (
              <SimpleButton href="/login" dataId="sign-in-button">
                {t("common.signIn")}
              </SimpleButton>
            )}
            {status === "authenticated" &&
              session?.user?.userType === "creator" && <UserAddMenu />}

            <CreditAmount />
            <LanguageSwitcher />
          </div>
        </div>
      </div>

      <MobileMenu
        openDrawer={openMenuDrawer}
        setOpenDrawer={setOpenMenuDrawer}
      />
    </>
  );
};

export default NavigationBar;
