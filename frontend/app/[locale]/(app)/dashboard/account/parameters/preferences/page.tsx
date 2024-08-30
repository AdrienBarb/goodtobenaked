"use client";

import React, { FC, useEffect, useState } from "react";
import PaddingContainer from "@/components/PaddingContainer";
import ContainerWithBackArrow from "@/components/ContainerWithBackArrow";
import { useTranslations } from "next-intl";
import useApi from "@/lib/hooks/useApi";
import FullButton from "@/components/Buttons/FullButton";
import { TAGS } from "@/constants/constants";
import { useRouter } from "@/navigation";

interface NotificationPageProps {}

const NotificationPage: FC<NotificationPageProps> = ({}) => {
  const t = useTranslations();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const { usePut, fetchData } = useApi();

  const router = useRouter();

  const { mutate: editUserPreferences, isLoading } = usePut(
    `/api/users/preferences`,
    {
      onSuccess: () => {
        router.push("/dashboard/account/parameters");
      },
    }
  );

  const getCurrentOwner = async () => {
    try {
      const r = await fetchData(`/api/users/owner`);

      setSelectedTags(r.preferences);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCurrentOwner();
  }, []);

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
    <>
      <ContainerWithBackArrow prevPath="/dashboard/account/parameters" />
      <PaddingContainer>
        <div className="flex flex-wrap gap-4 mb-12 w-full rounded-md">
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
      </PaddingContainer>
    </>
  );
};

export default NotificationPage;
