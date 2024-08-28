import React from "react";
import LandingButton from "./LandingButton";
import { useTranslations } from "next-intl";
import appScreenImage from "../public/images/app-screen.png";
import Image from "next/image";

const Landing = () => {
  const t = useTranslations();

  return (
    <div className="bg-primary lg:h-[80dvh] flex justify-center items-center mt-16 mx-8 rounded-md px-8 py-16 h-3/4">
      <div className="flex flex-col lg:flex-row justify-between items-center gap-16 max-w-5xl w-full">
        <div className="flex flex-col text-center lg:text-start items-center justify-center lg:items-start lg:max-w-lg">
          <h1
            data-id="homepage-title"
            className="text-4xl lg:text-5xl font-bold font-rubik text-background"
          >
            {t("home.title")}
          </h1>
          <h2 className="text-xl font-light font-karla text-background">
            {t("home.subTitle")}
          </h2>
          <div className="mt-4">
            <LandingButton />
          </div>
        </div>

        <Image src={appScreenImage} alt="Logo KYYNK" width={260} />
      </div>
    </div>
  );
};

export default Landing;
