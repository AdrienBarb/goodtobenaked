import { Skeleton } from "@mui/material/index";
import React from "react";

const HeaderSkeleton = () => {
  return (
    <div>
      <Skeleton
        variant="rectangular"
        width={200}
        height={40}
        style={{ borderRadius: "6px" }}
      />
      <Skeleton variant="rectangular" height={2} style={{ margin: "1rem 0" }} />
    </div>
  );
};

export default HeaderSkeleton;
