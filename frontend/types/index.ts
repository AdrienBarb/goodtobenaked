export type SocketUser = {
  userId: string;
  socketId: string;
};

export type AvailableFilters = {
  availableTags: {
    tag: string;
    count: number;
  }[];
};

export type NudeFilters = {
  [key: string]: string | boolean | null;
  tag: string;
  isFree: null | boolean;
  mediaTypes: null | "photo" | "video" | "bundle";
};
