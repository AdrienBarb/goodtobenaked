import PageContainer from "@/components/PageContainer";
import { client } from "@/client";
import styles from "@/styles/Article.module.scss";
import { PortableText } from "@portabletext/react";
import moment from "moment";
import imageUrlBuilder from "@sanity/image-url";
import "moment/locale/fr";
import { Metadata } from "next";
import { genPageMetadata } from "@/app/seo";
import { unstable_setRequestLocale } from "next-intl/server";

moment.locale("fr");

const urlFor = (source: string) => {
  return imageUrlBuilder(client).image(source);
};

export async function generateMetadata({
  params,
}: {
  params: { slug: string; locale: string };
}): Promise<Metadata | undefined> {
  const { slug, locale } = params;

  const post = await client.fetch(
    `
    *[_type == "post" && slug.current == $slug][0]
    `,
    { slug }
  );

  return genPageMetadata({
    title: post.localizedTitle?.[locale],
    description: post.seoDescription?.[locale],
  });
}

export const generateStaticParams = async () => {
  const paths = await client.fetch(
    `*[_type == "post" && defined(slug.current)][].slug.current`
  );

  return paths.map((slug: string) => ({ slug }));
};

const Article = async ({
  params,
}: {
  params: { slug: string; locale: string };
}) => {
  const { slug, locale } = params;
  unstable_setRequestLocale(locale);

  const post = await client.fetch(
    `
    *[_type == "post" && slug.current == $slug][0]
    `,
    { slug }
  );

  const { localizedTitle, content, _createdAt, mainImage } = post;

  return (
    <PageContainer>
      <div className={styles.container}>
        <article>
          <div className={styles.imageWrapper}>
            <img
              alt={`Image blog - ${localizedTitle?.[locale]}`}
              className={styles.image}
              src={urlFor(mainImage).url()}
            />
          </div>
          <div className={styles.header}>
            <h1>{localizedTitle?.[locale]}</h1>
            <p>{moment(_createdAt).format("DD MMM, YYYY")}</p>
          </div>

          <div className={styles.content}>
            <PortableText value={content?.[locale]} />
          </div>
        </article>
      </div>
    </PageContainer>
  );
};

export default Article;
export const revalidate = 3600;
