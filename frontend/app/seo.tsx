import { Metadata } from "next";
import siteMetadata from "@/data/siteMetadata";

interface PageSEOProps {
  title: string;
  description: string;
  image?: string;
  [key: string]: any;
}

export function genPageMetadata({
  title,
  description,
  image,
  url = "./",
  ...rest
}: PageSEOProps): Metadata {
  return {
    title,
    description,
    openGraph: {
      title: `${title} | ${siteMetadata.title}`,
      description: description || siteMetadata.description,
      url: url,
      siteName: siteMetadata.title,
      images: image ? [image] : [siteMetadata.socialBanner],
      locale: "fr_FR",
      type: "website",
    },
    twitter: {
      title: `${title} | ${siteMetadata.title}`,
      card: "summary_large_image",
      images: image ? [image] : [siteMetadata.socialBanner],
    },
    ...rest,
  };
}
