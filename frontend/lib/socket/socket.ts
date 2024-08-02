"use client";

import { io } from "socket.io-client";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const socket =
  typeof window !== "undefined" && apiUrl && typeof apiUrl === "string"
    ? io(apiUrl, {
        withCredentials: true,
        transports: ["websocket", "polling"],
      })
    : null;

export default socket;
