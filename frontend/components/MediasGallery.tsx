import React, { FC, useEffect, useState } from "react";
import styles from "@/styles/MediasGallery.module.scss";
import GalleryCard from "./GalleryCard";
import { Media } from "@/types/models/Media";
import { useTranslations } from "next-intl";
import NoResults from "./Common/NoResults";
import useApi from "@/lib/hooks/useApi";
import FullButton from "./Buttons/FullButton";
import UploadModal from "./UploadModal";
import socket from "@/lib/socket/socket";

interface MediasGalleryProps {
  setOpen: (e: boolean) => void;
  setSelectedMedias: (medias: Media[]) => void;
  selectedMedias: Media[];
  multiple: boolean;
  mediaType: string[];
}

const MediasGallery: FC<MediasGalleryProps> = ({
  setSelectedMedias,
  selectedMedias,
  multiple,
  mediaType,
}) => {
  const [medias, setMedias] = useState<Media[]>([]);
  const [openUploadModal, setOpenUploadModal] = useState(false);

  //traduction
  const t = useTranslations();

  const { usePut, fetchData } = useApi();

  const getMedias = async () => {
    const r = await fetchData("/api/medias");
    setMedias(r);
  };

  useEffect(() => {
    getMedias();

    if (!socket) return;

    socket?.off("mediaStatusUpdated")?.on("mediaStatusUpdated", (newMedia) => {
      setMedias((previousMedias: Media[]) =>
        previousMedias.map((m) => (newMedia._id === m._id ? newMedia : m))
      );
    });
  }, []);

  const { mutate: archiveMedia } = usePut(`/api/medias/archived`, {
    onSuccess: (archivedMediaId) => {
      setMedias((previousMedias: Media[]) =>
        previousMedias.filter((m) => m._id !== archivedMediaId)
      );
    },
  });

  const handleSelectMedia = (media: Media) => {
    if (!mediaType.includes(media.mediaType)) {
      return;
    }

    let clonedSelectedMedia = [...selectedMedias];

    if (multiple) {
      if (clonedSelectedMedia.some((el) => el._id === media._id)) {
        clonedSelectedMedia = clonedSelectedMedia.filter(
          (el) => el._id !== media._id
        );
      } else {
        clonedSelectedMedia = [...clonedSelectedMedia, media];
      }
    } else {
      if (clonedSelectedMedia.some((el) => el._id === media._id)) {
        clonedSelectedMedia = [];
      } else {
        clonedSelectedMedia = [media];
      }
    }

    setSelectedMedias(clonedSelectedMedia);
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.buttonWrapper}>
          <FullButton
            customStyles={{ width: "100%" }}
            onClick={() => setOpenUploadModal(true)}
          >
            {t("common.importImageOrVideo")}
          </FullButton>
        </div>

        {medias.length === 0 ? (
          <NoResults text={t("common.noMedia")} />
        ) : (
          <div className={styles.list}>
            {medias.map((currentMedia: Media) => {
              return (
                <div key={currentMedia._id}>
                  <GalleryCard
                    media={currentMedia}
                    handleSelectMedia={handleSelectMedia}
                    isSelected={selectedMedias.some(
                      (el) => el._id === currentMedia?._id
                    )}
                    shouldConfirmBeforeDelete={true}
                    deleteAction={(mediaId) => archiveMedia({ mediaId })}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
      <UploadModal
        setOpen={setOpenUploadModal}
        open={openUploadModal}
        setMedias={setMedias}
        medias={medias}
      />
    </>
  );
};

export default MediasGallery;
