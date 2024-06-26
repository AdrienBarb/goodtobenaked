import PageContainer from "@/components/PageContainer";
import { client } from "@/client";
import styles from "@/styles/SupportArticlePage.module.scss";
import BlogCard from "@/components/BlogCard";
import imageUrlBuilder from "@sanity/image-url";
import BlogMenu from "@/components/BlogMenu";
import { genPageMetadata } from "@/app/seo";
import { unstable_setRequestLocale } from "next-intl/server";

export const metadata = genPageMetadata({
  title: "Blog",
  description:
    "Explorez les tendances, conseils et astuces sur la plateforme Goodtobenaked dédiée aux amateurs de culottes sales. Découvrez nos articles de blog pour approfondir vos connaissances et enrichir votre expérience sur notre site.",
});

const BlogArticlePage = async ({
  params: { locale },
}: {
  params: { locale: string };
}) => {
  unstable_setRequestLocale(locale);

  const urlFor = (source: string) => {
    return imageUrlBuilder(client).image(source);
  };

  const posts = await client.fetch(`*[_type == "post"]{
    slug,
    localizedTitle,
    mainImage,
    "category": categories->{title, slug},
    publishedAt,
  }`);

  const categories = await client.fetch(`*[_type == "category"]{
    localizedTitle,
    slug,
  }`);

  return (
    <PageContainer>
      <div className={styles.container}>
        <h1>Blog</h1>
        <BlogMenu categories={categories} locale={locale} />
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
      </div>
    </PageContainer>
  );
};

export default BlogArticlePage;
