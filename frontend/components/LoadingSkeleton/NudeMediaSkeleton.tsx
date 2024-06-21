import { Skeleton } from "@mui/material";
import React from "react";

const NudeMediaSkeleton = () => {
  return (
    <Skeleton
      variant="rectangular"
      width={160}
      height={200}
      style={{ borderRadius: "6px" }}
    />
  );
};

export default NudeMediaSkeleton;
