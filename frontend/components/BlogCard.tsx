import React, { FC } from "react";
import styles from "@/styles/BlogCard.module.scss";
import { Link } from "@/navigation";

interface BlogCardProps {
  slug: string;
  title: string;
  imageSrc: string;
}

const BlogCard: FC<BlogCardProps> = ({ slug, title, imageSrc }) => {
  return (
    <div className={styles.container}>
      <div className={styles.imageWrapper}>
        <img
          alt={`Image blog - ${title}`}
          className={styles.image}
          src={imageSrc}
        />
      </div>
      <div className={styles.titleWrapper}>
        <Link href={`/blog/articles/${slug}`}>
          <h2>{title}</h2>
        </Link>
      </div>
    </div>
  );
};

export default BlogCard;
