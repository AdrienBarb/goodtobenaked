import * as React from "react";
import { Modal } from "@mui/material";
import styles from "@/styles/FullScreenImage.module.scss";
import { faDownLeftAndUpRightToCenter } from "@fortawesome/free-solid-svg-icons";
import IconButton from "@/components//Buttons/IconButton";
import { Media } from "@/types/models/Media";
import S3Image from "./S3Image";

interface Props {
  setOpen: (e: boolean) => void;
  open: boolean;
  image: Media;
}

const FullScreenImage: React.FC<Props> = ({ setOpen, open, image }) => {
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

          <S3Image
            imageKey={image.convertedKey}
            imageAlt={`media`}
            fill={true}
            styles={{
              objectFit: "cover",
            }}
          />
        </div>
      </div>
    </Modal>
  );
};

export default FullScreenImage;
