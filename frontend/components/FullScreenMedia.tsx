import * as React from "react";
import { Modal } from "@mui/material";
import styles from "@/styles/FullScreenMedia.module.scss";
import { faDownLeftAndUpRightToCenter } from "@fortawesome/free-solid-svg-icons";
import IconButton from "@/components//Buttons/IconButton";
import DisplayedMedia from "./DisplayedMedia";
import Navigation from "./Navigation";
import { Nude } from "@/types/models/Nude";
import MediaDetails from "./MediaDetails";
import NudeUserDetails from "./NudeUserDetails";
import useCanView from "@/lib/hooks/useCanView";
import BuyMediaButton from "./Buttons/BuyMediaButton";
import useIsOwner from "@/lib/hooks/useIsOwner";

interface FullScreenMediaProps {
  setOpen: (e: boolean) => void;
  open: boolean;
  nude: Nude;
  setCurrentNude: (e: Nude) => void;
}

const FullScreenMedia: React.FC<FullScreenMediaProps> = ({
  setOpen,
  open,
  nude,
  setCurrentNude,
}) => {
  const [currentMediaIndex, setCurrentMediaIndex] = React.useState<number>(0);

  const canView = useCanView(nude);
  const isOwner = useIsOwner(nude.user._id);

  return (
    <Modal open={open} onClose={setOpen} sx={{ overflow: "scroll" }}>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <div className={styles.iconButton}>
            <IconButton
              icon={faDownLeftAndUpRightToCenter}
              onClick={() => setOpen(false)}
              style={{}}
            />
          </div>

          <div className={styles.content}>
            <div className={styles.imageWrapper}>
              <MediaDetails medias={nude.medias} />
              <DisplayedMedia
                nude={nude}
                currentMediaIndex={currentMediaIndex}
                type="fullScreen"
              />
              {canView && nude.medias.length > 1 && (
                <Navigation
                  medias={nude.medias}
                  setCurrentMediaIndex={setCurrentMediaIndex}
                />
              )}

              {!canView && !isOwner && (
                <div className={styles.buyButton}>
                  <BuyMediaButton nude={nude} setCurrentNude={setCurrentNude} />
                </div>
              )}
            </div>
          </div>

          <div className={styles.top}>
            <NudeUserDetails nude={nude} showAvatar />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default FullScreenMedia;
