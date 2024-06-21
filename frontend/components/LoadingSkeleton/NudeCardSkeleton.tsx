import { Skeleton } from "@mui/material";
import React from "react";

const NudeCardSkeleton = () => {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
        <Skeleton variant="circular" width={46} height={46} />
        <Skeleton variant="rectangular" width={40} height={20} />
      </div>
      <Skeleton
        variant="rectangular"
        width={500}
        height={100}
        style={{ marginTop: "1rem" }}
      />
      <Skeleton
        variant="rectangular"
        width={400}
        height={500}
        style={{ marginTop: "1rem", borderRadius: "6px" }}
      />
    </div>
  );
};

export default NudeCardSkeleton;
