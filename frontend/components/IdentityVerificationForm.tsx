"use client";

import React, { useState, useMemo, FC, useEffect } from "react";
import Dropzone from "react-dropzone";
import styles from "@/styles/CreatorIdentityVerificationForm.module.scss";
import Image from "next/image";
import CloseIcon from "@mui/icons-material/Close";
import LoadingButton from "./Buttons/LoadingButton";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { useRouter } from "@/navigation";
import CenterHeader from "./CenterHeader";
import useApi from "@/lib/hooks/useApi";
import { User } from "@/types/models/User";

interface Props {}

const IdentityVerificationForm: FC<Props> = () => {
  const router = useRouter();
  const t = useTranslations();
  const [frontIdentity, setFrontIdentity] = useState<null | File>(null);
  const [backIdentity, setBackIdentity] = useState<null | File>(null);
  const [frontAndFaceIdentity, setFrontAndFaceIdentity] = useState<null | File>(
    null
  );
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const { data: session, update } = useSession();

  const { usePost, fetchData } = useApi();

  const { mutate: identityVerification, isLoading } = usePost(
    `/api/users/identity-verification`,
    {
      onSuccess: ({ verified }) => {
        if (session) {
          const updatedSession = {
            ...session,
            user: {
              ...session.user,
              verified: verified,
            },
          };

          update(updatedSession);
          router.push("/dashboard/account/become-creator");
        }
      },
    }
  );

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

  const onDropIdentityFront = (acceptedFiles: any) => {
    setFrontIdentity(acceptedFiles[0]);
  };
  const onDropIdentityBack = (acceptedFiles: any) => {
    setBackIdentity(acceptedFiles[0]);
  };
  const onDropIdentityFrontAndFace = (acceptedFiles: any) => {
    setFrontAndFaceIdentity(acceptedFiles[0]);
  };

  const handleSubmitForm = () => {
    if (!frontIdentity || !backIdentity || !frontAndFaceIdentity) {
      toast.error(t("error.missingPictures"));
      return;
    }

    let formData = new FormData();
    formData.append("frontIdentity", frontIdentity);
    formData.append("backIdentity", backIdentity);
    formData.append("frontAndFaceIdentity", frontAndFaceIdentity);

    identityVerification(formData);
  };

  const baseStyle = {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem",
    width: "100%",
    borderWidth: 2,
    borderRadius: 2,
    borderColor: "black",
    borderStyle: "dashed",
    backgroundColor: "transparent",
    outline: "none",
    transition: "border .24s ease-in-out",
  };

  const style = useMemo(
    () => ({
      ...baseStyle,
    }),
    []
  );

  return (
    <div className={styles.container}>
      {currentUser?.verified === "unverified" && (
        <div className={styles.status}>
          <CenterHeader
            tag="h2"
            title={t("common.identityUnverified")}
            description={t("common.identity_verification_explanation")}
          />
        </div>
      )}
      {currentUser?.verified === "rejected" && (
        <div className={styles.status}>
          <CenterHeader
            tag="h2"
            title={t("common.status_rejected")}
            description={t("common.reimport_document")}
          />
        </div>
      )}
      {currentUser?.verified === "pending" && (
        <div className={styles.status}>
          <CenterHeader
            tag="h2"
            title={t("common.being_verified")}
            description={t("common.pending_explanation")}
          />
        </div>
      )}
      {currentUser?.verified === "verified" && (
        <div className={styles.status}>
          <CenterHeader tag="h2" title={t("common.identityVerified")} />
        </div>
      )}

      {(currentUser?.verified === "unverified" ||
        currentUser?.verified === "rejected") && (
        <>
          <div className={styles.dropzoneContainer}>
            <div className={styles.dropzoneWrapper}>
              {frontIdentity ? (
                <div
                  className={styles.previewWrapper}
                  style={{
                    backgroundImage: `url(${URL.createObjectURL(
                      frontIdentity
                    )})`,
                  }}
                >
                  <div
                    className={styles.deleteIcon}
                    onClick={() => setFrontIdentity(null)}
                  >
                    <CloseIcon sx={{ color: "black" }} />
                  </div>
                </div>
              ) : (
                ""
              )}
              <Dropzone
                onDrop={onDropIdentityFront}
                multiple={false}
                accept={{
                  "image/png": [".png", ".jpg", ".jpeg"],
                }}
              >
                {({ getRootProps, getInputProps }) => (
                  <div {...getRootProps({ style })}>
                    <input {...getInputProps()} />

                    <div className={styles.dropzoneDetails}>
                      <h4>{t("common.front_face")}</h4>
                      <p>
                        <span className={styles.fileLink}>
                          {t("common.search")}
                        </span>{" "}
                        {t("common.or")}{" "}
                        <span className={styles.fileLink}>
                          {t("common.put")}
                        </span>{" "}
                        {t("common.file")}
                      </p>
                      <Image
                        alt="Image description devant de la carte d'identité"
                        src="/images/front-id.png"
                        width={300}
                        height={200}
                      />
                    </div>
                  </div>
                )}
              </Dropzone>
            </div>
            <div className={styles.dropzoneWrapper}>
              {backIdentity ? (
                <div
                  className={styles.previewWrapper}
                  style={{
                    backgroundImage: `url(${URL.createObjectURL(
                      backIdentity
                    )})`,
                  }}
                >
                  <div
                    className={styles.deleteIcon}
                    onClick={() => setBackIdentity(null)}
                  >
                    <CloseIcon sx={{ color: "black" }} />
                  </div>
                </div>
              ) : (
                ""
              )}
              <Dropzone
                onDrop={onDropIdentityBack}
                multiple={false}
                accept={{
                  "image/png": [".png", ".jpg", ".jpeg"],
                }}
              >
                {({ getRootProps, getInputProps }) => (
                  <div {...getRootProps({ style })}>
                    <input {...getInputProps()} />

                    <div className={styles.dropzoneDetails}>
                      <h4>{t("common.back_face")}</h4>
                      <p>
                        <span className={styles.fileLink}>
                          {t("common.search")}
                        </span>{" "}
                        {t("common.or")}{" "}
                        <span className={styles.fileLink}>
                          {t("common.put")}
                        </span>{" "}
                        {t("common.file")}
                      </p>
                      <Image
                        alt="Image description dos de la carte d'identité"
                        src="/images/back-id.png"
                        width={300}
                        height={200}
                      />
                    </div>
                  </div>
                )}
              </Dropzone>
            </div>
            <div className={styles.dropzoneWrapper}>
              {frontAndFaceIdentity ? (
                <div
                  className={styles.previewWrapper}
                  style={{
                    backgroundImage: `url(${URL.createObjectURL(
                      frontAndFaceIdentity
                    )})`,
                  }}
                >
                  <div
                    className={styles.deleteIcon}
                    onClick={() => setFrontAndFaceIdentity(null)}
                  >
                    <CloseIcon sx={{ color: "black" }} />
                  </div>
                </div>
              ) : (
                ""
              )}
              <Dropzone
                onDrop={onDropIdentityFrontAndFace}
                multiple={false}
                accept={{
                  "image/png": [".png", ".jpg", ".jpeg"],
                }}
              >
                {({ getRootProps, getInputProps }) => (
                  <div {...getRootProps({ style })}>
                    <input {...getInputProps()} />

                    <div className={styles.dropzoneDetails}>
                      <h4>{t("common.face_and_id")}</h4>
                      <p>
                        <span className={styles.fileLink}>
                          {t("common.search")}
                        </span>{" "}
                        {t("common.or")}{" "}
                        <span className={styles.fileLink}>
                          {t("common.put")}
                        </span>{" "}
                        {t("common.file")}
                      </p>
                      <Image
                        alt="Image description face et photo d'identité"
                        src="/images/face-and-id.png"
                        width={300}
                        height={200}
                      />
                    </div>
                  </div>
                )}
              </Dropzone>
            </div>
          </div>

          <ul>
            <li>{t("common.rule_1")}</li>
            <li>{t("common.rule_2")}</li>
            <li>{t("common.rule_3")}</li>
            <li>{t("common.rule_4")}</li>
          </ul>

          <div className={styles.message}>
            <div className={styles.divider}></div>
            <p>{t("common.info")}</p>
            <div className={styles.divider}></div>
          </div>

          <LoadingButton
            fullWidth
            type="submit"
            loading={isLoading}
            onClick={() => handleSubmitForm()}
          >
            {t("common.validate")}
          </LoadingButton>
        </>
      )}
      {/* <LoadingBackdrop open={isLoading} /> */}
    </div>
  );
};

export default IdentityVerificationForm;
