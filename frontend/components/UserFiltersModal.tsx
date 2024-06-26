import React, { useState, useEffect, ReactNode, FC } from "react";
import styles from "@/styles/FiltersModal.module.scss";
import CloseIcon from "@mui/icons-material/Close";
import FullButton from "@/components/Buttons/FullButton";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import FiltersNavCard from "@/components/FiltersNavCard";
import CheckboxCard from "@/components/CheckboxCard";
import { useRouter } from "next/navigation";
import { BODY_TYPE, HAIR_COLOR } from "@/constants/formValue";
import { useTranslations } from "next-intl";
import { Modal } from "@mui/material";
import { UserFilters } from "./UsersList";

const ageFilters = ["18-22", "22-30", "30-40", "40+"];

interface Props {
  open: boolean;
  setOpen: (e: boolean) => void;
  setFilters: (e: any) => void;
  filters: UserFilters;
}

const UserFiltersModal: FC<Props> = ({
  open,
  setOpen,
  setFilters,
  filters,
}) => {
  //traduction
  const t = useTranslations();

  //localstate
  const [modalType, setModalType] = useState<string | null>("base");
  const [view, setView] = useState<{
    title: string;
    deleteAll: boolean;
    previousModal: string | null;
    components: ReactNode | null;
  }>({
    title: "",
    deleteAll: false,
    previousModal: null,
    components: null,
  });

  const handleFiltersChange = (value: string) => {
    let queryClone: UserFilters = {
      ...filters,
    };

    if (!modalType) {
      return;
    }

    //@ts-ignore
    if (queryClone[modalType] === value) {
      queryClone = {
        ...queryClone,
        [modalType]: "",
      };
    } else {
      queryClone = {
        ...queryClone,
        [modalType]: value,
      };
    }

    setFilters(queryClone);
  };

  const handleDeleteCurrentFilter = (currentFilterType: string | null) => {
    if (!currentFilterType) {
      return;
    }

    setFilters({
      ...filters,
      [currentFilterType]: "",
    });
  };

  const handleDeleteAllFilter = () => {
    setFilters({
      ...filters,
      bodyType: "",
      hairColor: "",
      age: "",
    });
  };

  const handleShowResultClick = () => {
    setOpen(false);
  };

  useEffect(() => {
    switch (modalType) {
      case "base":
        setView({
          ...view,
          title: t("common.filters"),
          deleteAll: true,
          previousModal: null,
          components: (
            <>
              <FiltersNavCard
                text={t("db.body_type")}
                onClick={() => setModalType("bodyType")}
                currentFilter={filters.bodyType}
              />
              <FiltersNavCard
                text={t("db.hair_color")}
                onClick={() => setModalType("hairColor")}
                currentFilter={filters.hairColor}
              />
              <FiltersNavCard
                text={t("db.age")}
                onClick={() => setModalType("age")}
                currentFilter={filters.age}
              />
            </>
          ),
        });

        break;
      case "bodyType":
        setView({
          ...view,
          title: t("db.body_type"),
          deleteAll: false,
          previousModal: "base",
          components: (
            <>
              {BODY_TYPE.map((el) => {
                return (
                  <CheckboxCard
                    key={el}
                    text={t(`db.${el}`)}
                    checked={filters.bodyType === el}
                    onChange={() => handleFiltersChange(el)}
                  />
                );
              })}
            </>
          ),
        });
        break;
      case "hairColor":
        setView({
          ...view,
          title: t("db.hair_color"),
          deleteAll: false,
          previousModal: "base",
          components: (
            <>
              {HAIR_COLOR.map((el) => {
                return (
                  <CheckboxCard
                    key={el}
                    text={t(`db.${el}`)}
                    checked={filters.hairColor === el}
                    onChange={() => handleFiltersChange(el)}
                  />
                );
              })}
            </>
          ),
        });
        break;
      case "age":
        setView({
          ...view,
          title: t("db.age"),
          deleteAll: false,
          previousModal: "base",
          components: (
            <>
              {ageFilters.map((el) => {
                return (
                  <CheckboxCard
                    key={el}
                    text={el}
                    checked={filters.age === el}
                    onChange={() => handleFiltersChange(el)}
                  />
                );
              })}
            </>
          ),
        });
        break;

      default:
        break;
    }
  }, [modalType, filters]);

  return (
    <Modal open={open} onClose={setOpen}>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <div className={styles.header}>
            {view.previousModal ? (
              <ArrowBackIosNewIcon
                sx={{ cursor: "pointer" }}
                onClick={() => setModalType(view.previousModal)}
              />
            ) : (
              <CloseIcon
                sx={{ cursor: "pointer" }}
                onClick={() => setOpen(false)}
              />
            )}
            <div className={styles.modalTitle}>{view.title}</div>
            {view.deleteAll ? (
              <div
                onClick={handleDeleteAllFilter}
                className={styles.actionButton}
              >
                {t("common.delete_all")}
              </div>
            ) : (
              <div
                onClick={() => handleDeleteCurrentFilter(modalType)}
                className={styles.actionButton}
              >
                {t("common.delete_one")}
              </div>
            )}
          </div>
          <div className={styles.filtersWrapper}>{view.components}</div>
          <div className={styles.buttonWrapper}>
            <FullButton onClick={handleShowResultClick}>
              {t("common.show_result")}
            </FullButton>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default UserFiltersModal;
