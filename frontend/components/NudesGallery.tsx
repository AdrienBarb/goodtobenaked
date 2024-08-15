"use client";

import React, { FC, useState } from "react";
import styles from "@/styles/NudesGallery.module.scss";
import { Nude } from "@/types/models/Nude";
import NudesFeedList from "./NudesFeedList";

interface Props {
  nudes: Nude[];
}

const NudesGallery: FC<Props> = ({ nudes }) => {
  //localstate
  const [nudeList, setNudeList] = useState<Nude[]>(nudes);

  return (
    <div className={styles.container}>
      <NudesFeedList nudeList={nudeList} setNudeList={setNudeList} />
    </div>
  );
};

export default NudesGallery;
