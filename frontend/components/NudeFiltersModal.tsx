import React, { FC } from "react";
import CustomModal from "@/components/Modal";
import { useTranslations } from "next-intl";
import EmptyButton from "./Buttons/EmptyButton";
import FullButton from "./Buttons/FullButton";
import { NudeFilters } from "@/types";

interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
  setFilters: any;
  filters: NudeFilters;
}

const NudeFiltersModal: FC<Props> = ({
  open,
  setOpen,
  filters,
  setFilters,
}) => {
  const t = useTranslations("filters");

  const handleFiltersChange = (key: string, value: string | boolean) => {
    setFilters({
      ...filters,
      [key]: filters[key] === value ? null : value,
    });
  };

  const cleanFilters = () => {
    setFilters({
      ...filters,
      isFree: null,
      mediaTypes: null,
    });
  };

  return (
    <CustomModal
      open={open}
      onClose={setOpen}
      withCloseIcon
      title={t("Filters")}
    >
      <div className="max-w-xl w-full">
        <div className="mb-8">
          <h2 className="font-rubik text-lg mb-4">{t("MediaType")}</h2>
          <ul className="flex w-full border border-primary rounded-md">
            <li
              onClick={() => handleFiltersChange("mediaTypes", "bundle")}
              className={`${
                filters.mediaTypes === "bundle"
                  ? "text-background"
                  : "text-primary"
              } ${
                filters.mediaTypes === "bundle" ? "bg-primary" : "bg-background"
              } font-rubik font-light w-full text-center cursor-pointer hover:bg-primary-light p-2 rounded-md`}
            >
              {`${t("Bundle")}`}
            </li>
            <li
              onClick={() => handleFiltersChange("mediaTypes", "video")}
              className={`${
                filters.mediaTypes === "video"
                  ? "text-background"
                  : "text-primary"
              } ${
                filters.mediaTypes === "video" ? "bg-primary" : "bg-background"
              } font-rubik font-light w-full text-center cursor-pointer hover:bg-primary-light p-2 rounded-md`}
            >
              {`${t("Video")}`}
            </li>
            <li
              onClick={() => handleFiltersChange("mediaTypes", "photo")}
              className={`${
                filters.mediaTypes === "photo"
                  ? "text-background"
                  : "text-primary"
              } ${
                filters.mediaTypes === "photo" ? "bg-primary" : "bg-background"
              } font-rubik font-light w-full text-center cursor-pointer hover:bg-primary-light p-2 rounded-md`}
            >
              {`${t("Photo")}`}
            </li>
          </ul>
        </div>

        <div className="mb-12">
          <h2 className="font-rubik text-lg mb-4">{t("AccessType")}</h2>
          <ul className="flex w-full border border-primary rounded-md">
            <li
              onClick={() => handleFiltersChange("isFree", false)}
              className={`${
                filters.isFree === false ? "text-background" : "text-primary"
              } ${
                filters.isFree === false ? "bg-primary" : "bg-background"
              } font-rubik font-light w-full text-center cursor-pointer hover:bg-primary-light p-2 rounded-md`}
            >
              {`${t("Paid")}`}
            </li>
            <li
              onClick={() => handleFiltersChange("isFree", true)}
              className={`${
                filters.isFree === true ? "text-background" : "text-primary"
              } ${
                filters.isFree === true ? "bg-primary" : "bg-background"
              } font-rubik font-light w-full text-center cursor-pointer hover:bg-primary-light p-2 rounded-md`}
            >
              {`${t("Free")}`}
            </li>
          </ul>
        </div>

        <div className="flex w-full gap-4">
          <EmptyButton customStyles={{ width: "100%" }} onClick={cleanFilters}>
            {t("ClearFilters")}
          </EmptyButton>
          <FullButton
            customStyles={{ width: "100%" }}
            onClick={() => setOpen(false)}
          >
            {t("Show")}
          </FullButton>
        </div>
      </div>
    </CustomModal>
  );
};

export default NudeFiltersModal;
