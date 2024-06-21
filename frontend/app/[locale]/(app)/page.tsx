import { genPageMetadata } from "@/app/seo";
import { appRouter } from "@/appRouter";
import { client } from "@/client";
import Footer from "@/components/Footer";
import Landing from "@/components/Landing";
import LastArticleHomeSection from "@/components/LastArticleHomeSection";
import LastUsersHomeSection from "@/components/LastUsersHomeSection";
import userService from "@/features/user/userService";
import { redirect } from "@/navigation";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata | undefined> {
  const t = await getTranslations({ locale, namespace: "metadata" });

  return genPageMetadata({
    title: t("homeTitle"),
    description: t("homeDescription"),
  });
}

const Home = async ({ params: { locale } }: { params: { locale: string } }) => {
  const session = await getServerSession();

  if (session) {
    redirect(appRouter.feed);
  }

  const { users } = await userService.getAllUsers({});

  const posts =
    await client.fetch(`*[_type == "post"] | order(publishedAt desc) [0...6] {
    title,
    localizedTitle,
    slug,
    "authorName": author->name,
    mainImage,
    "category": categories->{title, slug},
    publishedAt,
    body,
    description
  }`);

  return (
    <>
      <Landing />
      <LastUsersHomeSection users={users} />
      <LastArticleHomeSection posts={posts} locale={locale} />
      <Footer />
    </>
  );
};

export default Home;
