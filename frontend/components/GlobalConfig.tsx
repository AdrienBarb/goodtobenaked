"use client";

import configService from "@/features/config/configService";
import React, { FC, ReactNode, useEffect, useState } from "react";
import Maintenance from "./Maintenance";

interface Props {
  children: ReactNode;
}

const GlobalConfig: FC<Props> = ({ children }) => {
  const [shouldAllowAccess, setShouldAllowAccess] = useState(true);

  useEffect(() => {
    const getConfig = async () => {
      try {
        const config = await configService.checkIsMaintenance();

        setShouldAllowAccess(config);
      } catch (error) {
        console.error(error);
      }
    };

    getConfig();
  }, []);

  if (!shouldAllowAccess) {
    return <Maintenance />;
  }

  return <>{children}</>;
};

export default GlobalConfig;
