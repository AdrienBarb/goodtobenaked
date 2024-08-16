import { trackEvent } from "fathom-client";

export const sendEvent = (eventName: string, value?: number) => {
  const env = process.env.NODE_ENV;
  if (env !== "production") return;

  if (value) {
    trackEvent(eventName, { _value: value });
  } else {
    trackEvent(eventName);
  }
};
