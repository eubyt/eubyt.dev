import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HobbyPage } from "@/components/page/HobbyPage";
import { isLocale, messagesByLocale, translate } from "@/lib/locale";
import { me, metaFor } from "@/lib/site";
import { siteOrigin } from "@/lib/site/origin";
import type { SocialLink } from "@/lib/socials";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/hobby">): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};

  const origin = await siteOrigin();
  const messages = messagesByLocale[raw];

  return {
    title: translate(messages, "meta.hobby.title"),
    description: metaFor(raw).hobby.description,
    alternates: {
      languages: {
        en: `${origin}/en/hobby`,
        "pt-BR": `${origin}/pt/hobby`,
        "x-default": `${origin}/en/hobby`,
      },
    },
  };
}

export default async function HobbyRoute({
  params,
}: PageProps<"/[locale]/hobby">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const origin = await siteOrigin();

  return (
    <>
      <link rel="describedby" href={`${origin}/llms.txt`} />
      <HobbyPage socials={me.socials.hobby as SocialLink[]} />
    </>
  );
}
