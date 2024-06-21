"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { reset } from "@/features/error-handling/errorHandlingSlice";
import { RootStateType, useAppDispatch } from "@/store/store";
import { useTranslations } from "next-intl";
import { useRouter } from "@/navigation";
import toast from "react-hot-toast";

const GlobalErrorHandler = () => {
  const router = useRouter();
  const state = useSelector((state: RootStateType) => state.error);
  const dispatch = useAppDispatch();
  const t = useTranslations();

  useEffect(() => {
    if (state.isError) {
      if (state.statusCode === 404) {
        router.push("/404");
      }

      if (state.statusCode && state.statusCode >= 500) {
        router.push("/500");
      }

      if (state.statusCode === 401) {
        router.push("/401");
      }

      if (state.toastMessage) {
        toast.error(t(`error.${state.toastMessage}`));
      }
    }

    dispatch(reset());
  }, [state.isError, state.toastMessage, state.statusCode]);

  return <></>;
};

export default GlobalErrorHandler;
