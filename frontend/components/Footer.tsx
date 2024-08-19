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
            <Image
              src={logo}
              alt="Logo Goodtobenaked"
              width={260}
              objectFit="cover"
            />
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
                <Link href="/blog/categories/goodtobenaked">
                  {t("footer.linkGtbn")}
                </Link>
              </li>
            </ul>
          </div>
          <div className={styles.menuSection}>
            <h4>{t("footer.alternatives")}</h4>
            <ul>
              <li>
                <Link href="/blog/articles/vends-ta-culotte-vos-culottes-sales-peuvent-elles-se-transformer-en-revenus">
                  Vends ta culotte
                </Link>
              </li>
              <li>
                <Link href="/blog/articles/mym-fans-faire-de-votre-contenu-un-gain">
                  Mym Fans
                </Link>
              </li>
              <li>
                <Link href="/blog/articles/balance-ta-nude-partage-intime-et-rentabilite">
                  Balance ta nude
                </Link>
              </li>
              <li>
                <Link href="/blog/articles/onlyfans-tout-ce-que-vous-devez-savoir-pour-reussir">
                  Onlyfans
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className={styles.divider}></div>
      <div className={styles.bottomFooter}>
        <p className={styles.copyright}>© Copyright 2023 - Goodtobenaked™</p>
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
