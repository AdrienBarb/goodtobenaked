import { client } from "@/client";
import { MetadataRoute } from "next";
import moment from "moment";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const blogPosts = await getAllBlogPosts();

  console.log("blogPosts ", blogPosts);

  const formattedBlogPosts = blogPosts.map((post: any) => {
    let publishedDate = moment(post.publishedAt).format("YYYY-MM-DD");

    return {
      url: `https://www.goodtobenaked.com/fr/blog/articles/${post.slug.current}`,
      lastModified: publishedDate,
      changeFrequency: "weekly",
      priority: 1,
      alternates: {
        languages: {
          en: `https://www.goodtobenaked.com/en/blog/articles/${post.slug.current}`,
        },
      },
    };
  });

  return [
    {
      url: "https://www.goodtobenaked.com/fr",
      lastModified: new Date(),
      alternates: {
        languages: {
          en: "https://www.goodtobenaked.com/en",
        },
      },
      changeFrequency: "weekly",
      priority: 1,
    },
    ...formattedBlogPosts,
  ];
}

async function getAllBlogPosts() {
  const categoriesWithPosts = await client.fetch(`*[_type == "post"]{
      title,
      slug,
      "authorName": author->name,
      mainImage,
      "category": categories->{title, slug},
      publishedAt,
      body,
      description
    }`);

  return categoriesWithPosts;
}
