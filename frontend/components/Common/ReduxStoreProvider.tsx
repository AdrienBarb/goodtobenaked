"use client";

import React, { FC, ReactNode } from "react";
import { Provider } from "react-redux";
import { store } from "@/store/store";

interface ReduxStoreProviderProps {
  children: ReactNode;
}

const ReduxStoreProvider: FC<ReduxStoreProviderProps> = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};

export default ReduxStoreProvider;
