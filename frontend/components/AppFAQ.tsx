import React, { FC } from "react";
import LandingHeader from "./LandingHeader";
import { useTranslations } from "next-intl";

interface Props {}

const AppFAQ: FC<Props> = ({}) => {
  const t = useTranslations();

  const data = {
    rows: [
      {
        title: t("home.question1"),
        content: t("home.content1"),
      },
      {
        title: t("home.question2"),
        content: t("home.content2"),
      },
      {
        title: t("home.question3"),
        content: t("home.content3"),
      },
    ],
  };

  return (
    <section className="max-w-4xl mx-auto py-16 px-4">
      <LandingHeader title={t("home.faqTitle")} />
      <div className="flex flex-col gap-4">
        {data.rows.map((item, index) => (
          <div key={index} className="bg-primary rounded-md p-4">
            <h2 className="text-lg font-medium">{item.title}</h2>
            <h3 className="text-sm font-thin">{item.content}</h3>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AppFAQ;
