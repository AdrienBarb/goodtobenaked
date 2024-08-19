"use client";

import React, { FC, useEffect, useState } from "react";
import styles from "@/styles/NudesGallery.module.scss";
import { Nude } from "@/types/models/Nude";
import NudesFeedList from "./NudesFeedList";

interface Props {
  nudes: Nude[];
}

const NudesGallery: FC<Props> = ({ nudes }) => {
  //localstate
  const [nudeList, setNudeList] = useState<Nude[]>(nudes);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const element = document.getElementById(hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: "auto", block: "start" });
      }
    }
  }, [nudeList]);

  return (
    <div className={styles.container}>
      <NudesFeedList nudeList={nudeList} setNudeList={setNudeList} />
    </div>
  );
};

export default NudesGallery;
