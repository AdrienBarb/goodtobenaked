import { format } from "date-fns";

export const formatMilliseconds = (milliseconds: any) => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return format(new Date(0, 0, 0, 0, minutes, seconds), "mm:ss");
};
