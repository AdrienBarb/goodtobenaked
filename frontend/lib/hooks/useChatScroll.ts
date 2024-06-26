import { Message } from "@/types/models/Message";
import { useEffect, useRef } from "react";

export const useChatScroll = (dep: Message[]) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [dep]);

  return ref;
};
