import React from "react";
import Loader from "@/components/Loader";

const Loading = () => {
  return (
    <div
      style={{
        height: "80vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Loader size={62} />
    </div>
  );
};

export default Loading;
