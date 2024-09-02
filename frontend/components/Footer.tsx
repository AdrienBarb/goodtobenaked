import React from "react";
import styles from "../styles/Footer.module.scss";
import logo from "../public/images/logo-white.svg";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/navigation";

const Footer = () => {
  //others
  const t = useTranslations();

  return (
    <footer className={styles.container} data-id="homepage-footer">
      <div className={styles.wrapper}>
        <div className={styles.footerLeft}>
          <div className={styles.logoWrapper}>
            <Image src={logo} alt="Logo KYYNK" width={120} objectFit="cover" />
          </div>
          <h2 className={styles.footerText}>{t("metadata.homeDescription")}</h2>
        </div>
        <div className={styles.footerRight}>
          <div className={styles.menuSection}>
            <h4>{t("footer.support")}</h4>
            <ul>
              <li>
                <Link href="/contact-us">{t("footer.contactUs")}</Link>
              </li>
              <li>
                <Link href="/report-bug">{t("footer.bug")}</Link>
              </li>
              <li>
                <Link href="/report-content">{t("footer.content")}</Link>
              </li>
            </ul>
          </div>
          <div className={styles.menuSection}>
            <h4>{t("footer.blog")}</h4>
            <ul>
              <li>
                <Link href="/blog">{t("footer.allArticles")}</Link>
              </li>
              <li>
                <Link href="/blog/categories/vente-de-culottes">
                  {t("footer.linkSellPanties")}
                </Link>
              </li>
              <li>
                <Link href="/blog/categories/bdsm">{t("footer.linkBdsm")}</Link>
              </li>
              <li>
                <Link href="/blog/categories/fetichisme">
                  {t("footer.linkFetish")}
                </Link>
              </li>
              <li>
                <Link href="/blog/categories/kyynk">
                  {t("footer.linkGtbn")}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className={styles.divider}></div>
      <div className={styles.bottomFooter}>
        <p className={styles.copyright}>© Copyright 2023 - KYYNK</p>
        <div className={styles.legalLink}>
          <Link href="/legal/terms-of-use">{t("footer.termsOfUse")}</Link>
          <Link href="/legal/legal-notice">{t("footer.legalNotice")}</Link>
          <Link href="/legal/privacy">{t("footer.confidentiality")}</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
