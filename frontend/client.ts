import { createClient } from "@sanity/client";

export const client = createClient({
  projectId: "00jx02d6",
  dataset: "goodtobenaked",
  apiVersion: "2021-08-31",
  useCdn: true,
});
