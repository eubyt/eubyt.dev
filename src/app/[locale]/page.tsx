import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PortfolioPage } from "@/components/page/PortfolioPage";
import type { SkillGroup } from "@/components/page/skills";
import { getGithubUser } from "@/lib/github";
import { isLocale, messagesByLocale, translate } from "@/lib/locale";
import { me, metaFor, personJsonLd } from "@/lib/site";
import { siteOrigin } from "@/lib/site/origin";
import type { SocialLink } from "@/lib/socials";

function primaryEmail() {
  return (
    me.emails.find((email) => email.primary)?.address ?? me.emails[0]!.address
  );
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};

  const origin = await siteOrigin();
  const messages = messagesByLocale[raw];
  const nameParams = { name: me.name };

  return {
    title: {
      absolute: translate(messages, "meta.home.title", nameParams),
    },
    description: metaFor(raw).home.description,
    alternates: {
      languages: {
        en: `${origin}/en`,
        "pt-BR": `${origin}/pt`,
        "x-default": `${origin}/en`,
      },
    },
  };
}

export default async function Home({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const origin = await siteOrigin();
  const user = await getGithubUser(me.githubUsername);
  const jsonLd = personJsonLd(origin);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <link rel="describedby" href={`${origin}/llms.txt`} />
      <PortfolioPage
        avatarUrl={user.avatar_url}
        email={primaryEmail()}
        emailCopyable
        socials={me.socials.portfolio as SocialLink[]}
        skillGroups={me.skills as SkillGroup[]}
      />
    </>
  );
}
