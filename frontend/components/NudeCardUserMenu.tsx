import React, { FC, useState } from "react";

import { useRouter } from "@/navigation";
import { Nude } from "@/types/models/Nude";
import ConfirmationModal from "./ConfirmationModal";
import { useTranslations } from "next-intl";
import useApi from "@/lib/hooks/useApi";
import DotMenuContainer from "./Common/Menu/DotMenuContainer";
import MenuElement from "./Common/Menu/MenuElement";

interface MenuButtonProps {
  nude: Nude;
  setNudeList?: (nudes: Nude[] | ((prevNudes: Nude[]) => Nude[])) => void;
}

const NudeCardUserMenu: FC<MenuButtonProps> = ({ nude, setNudeList }) => {
  //localstate
  const [openConfirmationModal, setOpenConfirmationModal] =
    useState<boolean>(false);

  //router
  const router = useRouter();

  const { usePut } = useApi();

  const { mutate: deleteNude } = usePut(`/api/nudes/${nude._id}/archived`, {
    onSuccess: (data) => {
      if (setNudeList) {
        setNudeList((previousNudesList) =>
          previousNudesList.filter(
            (currentNude) => currentNude._id !== data._id
          )
        );
      }
    },
  });

  const t = useTranslations();

  const handleEditClick = () => {
    router.push(`/dashboard/account/add/nudes?nudeId=${nude._id}`);
  };

  const handleDeleteClick = () => {
    setOpenConfirmationModal(true);
  };

  return (
    <DotMenuContainer>
      <MenuElement onClick={handleEditClick}>{t("common.edit")}</MenuElement>

      <MenuElement
        customStyles={{
          color: "red",
        }}
        onClick={handleDeleteClick}
      >
        {t("common.delete")}
      </MenuElement>

      <ConfirmationModal
        setOpen={setOpenConfirmationModal}
        open={openConfirmationModal}
        confirmAction={() => deleteNude({})}
        text={t("error.sureDeleteThisNude")}
      />
    </DotMenuContainer>
  );
};

export default NudeCardUserMenu;
