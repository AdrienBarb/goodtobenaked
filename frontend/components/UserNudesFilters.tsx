import React, { FC } from "react";
import IconButton from "./Buttons/IconButton";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { NudeFilters, TagsList } from "@/types";
import { useTranslations } from "next-intl";

interface Props {
  tagsList: TagsList[];
  setFilters: any;
  filters: NudeFilters;
}

const UserNudesFilters: FC<Props> = ({ tagsList, setFilters, filters }) => {
  const t = useTranslations();

  return (
    <div className="flex gap-2 overflow-x-auto">
      <IconButton
        icon={faFilter}
        style={{ backgroundColor: "#fff0eb" }}
        iconColor="#cecaff"
      />
      {tagsList &&
        tagsList.length > 0 &&
        tagsList.map((currentTag, index) => {
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
                filters.tag === currentTag.tag ? "bg-primary" : "bg-background"
              }`}
              key={index}
            >{`${t(`nudeCategories.${currentTag.tag}`)} (${
              currentTag.count
            })`}</div>
          );
        })}
    </div>
  );
};

export default UserNudesFilters;
