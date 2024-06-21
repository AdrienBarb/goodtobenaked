import { Skeleton } from "@mui/material";
import React from "react";

const ConversationSkeleton = () => {
  return (
    <Skeleton
      variant="rectangular"
      height={60}
      style={{ borderRadius: "6px" }}
    />
  );
};

export default ConversationSkeleton;
