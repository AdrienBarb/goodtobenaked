import React from "react";
import styles from "@/styles/LastArticleHomeSection.module.scss";
import BlogCard from "@/components/BlogCard";
import imageUrlBuilder from "@sanity/image-url";
import { client } from "@/client";
import { useTranslations } from "next-intl";

const LastArticleHomeSection = ({
  posts = [],
  locale,
}: {
  posts: any[];
  locale: string;
}) => {
  const t = useTranslations();

  const urlFor = (source: string) => {
    return imageUrlBuilder(client).image(source);
  };

  return (
    <section className={styles.container}>
      <h2>{t("home.weTalkAboutSexe")}</h2>
      <div className={styles.blogList}>
        {posts.map((currentPost: any, idx: number) => {
          return (
            <BlogCard
              key={idx}
              slug={currentPost?.slug?.current}
              title={currentPost.localizedTitle[locale]}
              imageSrc={urlFor(currentPost.mainImage).url()}
            />
          );
        })}
      </div>
    </section>
  );
};

export default LastArticleHomeSection;
