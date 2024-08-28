import { useCookies } from "react-cookie";
import { useSession } from "next-auth/react";

const useNavigateToPayment = () => {
  const { data: session } = useSession();
  const [, setCookie] = useCookies(["api-kyynk"]);

  const navigateToPayment = () => {
    if (session?.user?.accessToken) {
      const isProduction = process.env.NODE_ENV === "production";
      setCookie("api-kyynk", session?.user?.accessToken, {
        path: "/",
        maxAge: 900,
        sameSite: "lax",
        ...(isProduction && { domain: ".kyynk.com" }),
      });

      window.location.href =
        process.env.NEXT_PUBLIC_API_URL + "payment/packages";
    }
  };

  return navigateToPayment;
};

export default useNavigateToPayment;
