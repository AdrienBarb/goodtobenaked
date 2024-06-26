import dynamic from "next/dynamic";
import React from "react";

const Loader = dynamic(() => import("@/components/Loader"), { ssr: false });

const loading = () => {
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

export default loading;
