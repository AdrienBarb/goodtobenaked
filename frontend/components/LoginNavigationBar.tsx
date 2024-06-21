"use client";

import React from "react";
import styles from "@/styles/NavigationBar.module.scss";
import Image from "next/image";
import LanguageSwitcher from "./LanguageSwitcher";
import { Link } from "@/navigation";

const LoginNavigationBar = () => {
  return (
    <>
      <header className={styles.navContainer}>
        <div className={styles.navbar}>
          <Link href={"/"} passHref prefetch>
            <div className={styles.logo}>
              <Image
                src={"/images/logo.svg"}
                alt="logo"
                fill={true}
                objectFit="contain"
              />
            </div>
          </Link>

          {/* <LanguageSwitcher /> */}
        </div>
      </header>
    </>
  );
};

export default LoginNavigationBar;
