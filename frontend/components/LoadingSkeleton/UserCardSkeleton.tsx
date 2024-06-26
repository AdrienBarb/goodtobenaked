import { Skeleton } from "@mui/material/index";
import React from "react";

const UserCardSkeleton = () => {
  return (
    <div>
      <Skeleton
        variant="rectangular"
        height={300}
        style={{ borderRadius: "6px", marginBottom: "0.2rem" }}
      />
      <Skeleton
        variant="rectangular"
        height={10}
        width={30}
        style={{ borderRadius: "6px" }}
      />
    </div>
  );
};

export default UserCardSkeleton;
