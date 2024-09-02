import React, { FC, useState } from "react";
import IconButton from "./Buttons/IconButton";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { AvailableFilters, NudeFilters } from "@/types";
import { useTranslations } from "next-intl";
import NudeFiltersModal from "./NudeFiltersModal";

interface Props {
  availableFilters: AvailableFilters;
  setFilters: any;
  filters: NudeFilters;
}

const UserNudesFilters: FC<Props> = ({
  availableFilters,
  setFilters,
  filters,
}) => {
  const t = useTranslations();
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <div className="flex gap-2 overflow-x-auto">
        <IconButton
          icon={faFilter}
          style={{ backgroundColor: "#fff0eb" }}
          iconColor="#cecaff"
          onClick={() => setOpenModal(true)}
        />
        {availableFilters.availableTags &&
          availableFilters.availableTags.length > 0 &&
          availableFilters.availableTags.map((currentTag, index) => {
            return (
              <div
                onClick={() => {
                  setFilters({
                    ...filters,
                    tag: filters.tag === currentTag.tag ? "" : currentTag.tag,
                  });
                }}
                className={` ${
                  filters.tag === currentTag.tag
                    ? "text-background"
                    : "text-primary"
                } flex items-center justify-center border border-primary px-2 cursor-pointer rounded-md whitespace-nowrap ${
                  filters.tag === currentTag.tag
                    ? "bg-primary"
                    : "bg-background"
                }`}
                key={index}
              >{`${t(`nudeCategories.${currentTag.tag}`)} (${
                currentTag.count
              })`}</div>
            );
          })}
      </div>
      <NudeFiltersModal
        open={openModal}
        setOpen={setOpenModal}
        setFilters={setFilters}
        filters={filters}
      />
    </>
  );
};

export default UserNudesFilters;
