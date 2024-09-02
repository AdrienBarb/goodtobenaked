"use client";

import React, { useState } from "react";
import PageContainer from "@/components/PageContainer";
import UserSignUpForm from "@/components/UserSignUpForm";
import styles from "@/styles/AuthPage.module.scss";
import EmptyButton from "@/components/Buttons/EmptyButton";
import { useTranslations } from "next-intl";
import FullButton from "@/components/Buttons/FullButton";
import { useSession } from "next-auth/react";
import useApi from "@/lib/hooks/useApi";
import { useRouter } from "@/navigation";
import { appRouter } from "@/appRouter";
import { TAGS } from "@/constants/constants";

const SignUpPage = () => {
  const t = useTranslations();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const { usePut } = useApi();

  const router = useRouter();

  const { mutate: editUserPreferences, isLoading } = usePut(
    `/api/users/preferences`,
    {
      onSuccess: () => {
        router.push(appRouter.feed);
      },
    }
  );

  const handleTagSelection = (tag: string) => {
    let clonedSelectedTags = [...selectedTags];

    if (clonedSelectedTags.includes(tag)) {
      clonedSelectedTags = [...clonedSelectedTags.filter((t) => t !== tag)];
    } else {
      clonedSelectedTags = [...clonedSelectedTags, tag];
    }

    setSelectedTags(clonedSelectedTags);
  };

  return (
    <PageContainer>
      <div className="max-w-lg mx-auto">
        <h2 className="font-rubik text-xl font-semibold mb-16 mx-auto w-full text-center">
          {t("common.whatPreferences")}
        </h2>

        <div className="flex flex-wrap p-4 gap-4 mb-12 border border-neutral-200 w-full rounded-md">
          {TAGS.map((currentTag, index) => {
            return (
              <div
                key={index}
                onClick={() => handleTagSelection(currentTag.value)}
                className={`text-center lg:w-fit border border-neutral-200 rounded-md p-2 cursor-pointer hover:border-neutral-200 hover:bg-neutral-200 ${
                  selectedTags.includes(currentTag.value)
                    ? "bg-primary border-primary"
                    : ""
                }`}
              >
                {t(`nudeCategories.${currentTag.label}`)}
              </div>
            );
          })}
        </div>

        <FullButton
          customStyles={{ width: "100%" }}
          isLoading={isLoading}
          onClick={() => {
            editUserPreferences({ preferences: selectedTags });
          }}
        >
          {t("common.continue")}
        </FullButton>
      </div>
    </PageContainer>
  );
};

export default SignUpPage;
