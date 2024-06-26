"use client";

import { io } from "socket.io-client";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

console.log("apiUrl ", apiUrl);

const socket =
  typeof window !== "undefined" && apiUrl && typeof apiUrl === "string"
    ? io(apiUrl)
    : null;

console.log("socket ", socket);

export default socket;
