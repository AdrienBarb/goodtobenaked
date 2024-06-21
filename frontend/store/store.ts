"use client";

import { configureStore } from "@reduxjs/toolkit";
import forgotPasswordSlice from "@/features/forgot-password/forgotPasswordSlice";
import errorHandlingSlice from "@/features/error-handling/errorHandlingSlice";
import configSlice from "@/features/config/configSlice";
import socketIOSlice from "@/features/socketIO/socketIOSlice";
import adminSlice from "@/features/admin/adminSlice";
import notificationSlice from "@/features/notification/notificationSlice";
import { useDispatch } from "react-redux";
import userSlice from "@/features/user/userSlice";
import conversationSlice from "@/features/conversation/conversationSlice";

export const store = configureStore({
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  reducer: {
    forgotPassword: forgotPasswordSlice,
    error: errorHandlingSlice,
    config: configSlice,
    socket: socketIOSlice,
    admin: adminSlice,
    notification: notificationSlice,
    user: userSlice,
    conversation: conversationSlice,
  },
});

export type RootStateType = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
