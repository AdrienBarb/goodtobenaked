import React, { FC, useState } from "react";
import styles from "@/styles/ShareModal.module.scss";
import CustomModal from "@/components/Modal";
import {
  TwitterShareButton,
  TelegramShareButton,
  FacebookShareButton,
} from "react-share";
import LinkIcon from "@mui/icons-material/Link";
import TwitterIcon from "@mui/icons-material/Twitter";
import FacebookIcon from "@mui/icons-material/Facebook";
import TelegramIcon from "@mui/icons-material/Telegram";
import { useTranslations } from "next-intl";
import { usePathname } from "@/navigation";
import { useParams } from "next/navigation";

interface ShareModalProps {
  open: boolean;
  setOpen: (value: boolean) => void;
}

const ShareModal: FC<ShareModalProps> = ({ open, setOpen }) => {
  const [isLinkCopied, setIsLinkCopier] = useState(false);
  const pathname = usePathname();
  const { locale } = useParams();

  const t = useTranslations();

  const urlToShare = `${process.env.NEXT_PUBLIC_BASE_URL}/${locale}${pathname}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(urlToShare);
      setIsLinkCopier(true);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <CustomModal
      open={open}
      onClose={setOpen}
      withCloseIcon
      title={t("common.share")}
    >
      <div className={styles.container}>
        <div className={styles.shareIconsList}>
          <TwitterShareButton
            url={urlToShare}
            title={t("profile.shareTitleSocialMedia")}
          >
            <div className={styles.iconContainer}>
              <div className={styles.iconsWrapper}>
                <TwitterIcon sx={{ color: "#FFF0EB" }} />
              </div>
              <p>Twitter</p>
            </div>
          </TwitterShareButton>
          <FacebookShareButton
            url={urlToShare}
            title={t("profile.shareTitleSocialMedia")}
          >
            <div className={styles.iconContainer}>
              <div className={styles.iconsWrapper}>
                <FacebookIcon sx={{ color: "#FFF0EB" }} />
              </div>
              <p>Facebook</p>
            </div>
          </FacebookShareButton>
          <TelegramShareButton
            url={urlToShare}
            title={t("profile.shareTitleSocialMedia")}
          >
            <div className={styles.iconContainer}>
              <div className={styles.iconsWrapper}>
                <TelegramIcon sx={{ color: "#FFF0EB" }} />
              </div>
              <p>Telegram</p>
            </div>
          </TelegramShareButton>
          <div className={styles.iconContainer} onClick={copyToClipboard}>
            <div className={styles.iconsWrapper}>
              <LinkIcon sx={{ color: "#FFF0EB" }} />
            </div>
            <p>{isLinkCopied ? "Lien copié" : "Lien"}</p>
          </div>
        </div>
      </div>
    </CustomModal>
  );
};

export default ShareModal;
