import PageContainer from "@/components/PageContainer";
import styles from "@/styles/SupportArticlePage.module.scss";
import BlogCard from "@/components/BlogCard";
import imageUrlBuilder from "@sanity/image-url";
import BlogMenu from "@/components/BlogMenu";
import { client } from "@/client";
import { Metadata } from "next";
import { genPageMetadata } from "@/app/seo";
import { unstable_setRequestLocale } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: { category: string; locale: string };
}): Promise<Metadata | undefined> {
  const { category: categorySlug, locale } = params;
  unstable_setRequestLocale(locale);

  const category = await client.fetch(
    `
        *[_type == "category" && slug.current == $categorySlug][0]{
            localizedTitle,
            localizedDescription,
        }
    `,
    { categorySlug }
  );

  return genPageMetadata({
    title: category.localizedTitle[locale],
    description: category.localizedDescription[locale],
  });
}

const BlogArticlePage = async ({
  params,
}: {
  params: { category: string; locale: string };
}) => {
  const { category: categorySlug, locale } = params;

  const category = await client.fetch(
    `
        *[_type == "category" && slug.current == $categorySlug][0]{
            localizedTitle,
            slug,
            "posts": *[_type == "post" && references(^._id)]{
                localizedTitle,
                slug,
                excerpt,
                mainImage,
                publishedAt
            }
        }
    `,
    { categorySlug }
  );

  const categories = await client.fetch(`*[_type == "category"]{
        localizedTitle,
        slug,
    }`);

  const urlFor = (source: string) => {
    return imageUrlBuilder(client).image(source);
  };

  return (
    <PageContainer>
      <div className={styles.container}>
        <h1>{category.localizedTitle[locale]}</h1>
        <BlogMenu categories={categories} locale={locale} />
        <div className={styles.blogList}>
          {category.posts.map((currentPost: any, idx: number) => {
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
      </div>
    </PageContainer>
  );
};

export default BlogArticlePage;
export const revalidate = 3600;
