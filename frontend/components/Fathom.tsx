"use client"; // 👈 Don't forget your client directive

import { load, trackPageview } from "fathom-client";
import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function TrackPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const env = process.env.NODE_ENV;
    if (env !== "production") return;

    load("FQVVZMVY", {
      auto: false,
      includedDomains: ["www.kyynk.com", "kyynk.com"],
    });
  }, []);

  useEffect(() => {
    if (!pathname) return;

    trackPageview({
      url: pathname + searchParams.toString(),
      referrer: document.referrer,
    });
  }, [pathname, searchParams]);

  return null;
}

export default function Fathom() {
  return (
    <Suspense fallback={null}>
      <TrackPageView />
    </Suspense>
  );
}
