"use client";

import React, { useState, useMemo, FC } from "react";
import styles from "@/styles/UserSearch.module.scss";
import FilterListIcon from "@mui/icons-material/FilterList";
import UserFiltersModal from "./UserFiltersModal";
import { UserFilters } from "./UsersList";

interface Props {
  setFilters: (e: any) => void;
  filters: UserFilters;
}

const UserSearch: FC<Props> = ({ setFilters, filters }) => {
  const [open, setOpen] = useState(false);

  const filterCounter: number = useMemo(() => {
    const values: string[] = Object.values(filters) as string[];
    return values.reduce((count, value) => {
      return count + (value.trim() !== "" ? 1 : 0);
    }, 0);
  }, [filters]);

  return (
    <div className={styles.container}>
      <div className={styles.filterButton} onClick={() => setOpen(true)}>
        <FilterListIcon />
        {filterCounter > 0 && <div>{filterCounter}</div>}
      </div>
      <UserFiltersModal
        open={open}
        setOpen={setOpen}
        setFilters={setFilters}
        filters={filters}
      />
    </div>
  );
};

export default UserSearch;
