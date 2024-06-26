"use client";

import { Nude } from "@/types/models/Nude";
import { usePathname, useRouter } from "@/navigation";

const useRedirectToLoginPage = () => {
  const router = useRouter();
  const pathname = usePathname();

  const redirectToLoginPage = () => {
    router.push(`/login?previousPath=${pathname}`);
  };

  return redirectToLoginPage;
};

export default useRedirectToLoginPage;
