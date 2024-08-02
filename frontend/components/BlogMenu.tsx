import React, { FC } from "react";
import styles from "@/styles/BlogMenu.module.scss";
import { useTranslations } from "next-intl";
import clsx from "clsx";
import { Link } from "@/navigation";

interface BlogMenuProps {
  categories: any[];
  locale: string;
}

const BlogMenu: FC<BlogMenuProps> = ({ categories, locale }) => {
  const t = useTranslations("blog");

  return (
    <div className={styles.container}>
      <div className={styles.linksWrapper}>
        <div className={clsx(styles.link)}>
          <Link href="/blog">{t("allArticles")}</Link>
        </div>
        {categories &&
          categories.length > 0 &&
          categories.map((bc: any, index: number) => {
            return (
              <div key={index} className={clsx(styles.link)}>
                <Link href={`/blog/categories/${bc?.slug?.current}`}>
                  {bc?.localizedTitle[locale]}
                </Link>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default BlogMenu;
