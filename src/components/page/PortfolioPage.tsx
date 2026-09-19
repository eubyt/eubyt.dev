"use client";

import Image from "next/image";
import type { IconType } from "react-icons";
import {
  GridIntersection,
  GridLineH,
} from "@/components/grid";
import { AboutBio } from "@/components/page/about-bio";
import { FolioShell } from "@/components/page/folio-shell";
import { GithubContributions } from "@/components/page/github-contributions";
import { Hobbies } from "@/components/page/hobbies-teaser";
import { Skills, type SkillGroup } from "@/components/page/skills";
import { EmailLink } from "@/components/ui/email-link";
import { TextLink } from "@/components/ui/text-link";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { me, profileFor } from "@/lib/site";
import {
  socialIcons,
  socialLabels,
  type SocialLink,
} from "@/lib/socials";
import { useLocale, useTranslations } from "@/providers/locale";

type PortfolioPageProps = {
  avatarUrl: string;
  email: string;
  emailCopyable?: boolean;
  socials: SocialLink[];
  skillGroups: SkillGroup[];
};

function SocialIconLink({
  href,
  label,
  Icon,
}: {
  href: string;
  label: string;
  Icon: IconType;
}) {
  const t = useTranslations();

  return (
    <Tooltip>
      <TooltipTrigger render={<TextLink href={href} size="icon" external />}>
        <Icon aria-hidden />
        <span className="sr-only">
          {label} {t("profile.opensInNewTab")}
        </span>
      </TooltipTrigger>
      <TooltipContent side="bottom">{label}</TooltipContent>
    </Tooltip>
  );
}

function Header({
  avatarUrl,
  email,
  emailCopyable = false,
  socials,
}: {
  avatarUrl: string;
  email: string;
  emailCopyable?: boolean;
  socials: SocialLink[];
}) {
  const { locale } = useLocale();
  const t = useTranslations();
  const name = me.name;
  const taglineLines = profileFor(locale).tagline.split("\n");

  return (
    <header className="flex w-full items-center justify-between gap-4">
      <Image
        src={avatarUrl}
        alt={t("profile.avatarAlt", { name })}
        width={192}
        height={192}
        priority
        sizes="96px"
        className="size-20 shrink-0 rounded-2xl border border-border object-cover sm:size-24"
      />
      <div className="flex flex-col items-end gap-2.5 text-right">
        <p className="text-caption text-muted-foreground">
          {taglineLines.map((line, index) => (
            <span key={line}>
              {index > 0 ? <br /> : null}
              {line}
            </span>
          ))}
        </p>
        <nav aria-label={t("profile.socialNav")}>
          <ul className="flex items-center gap-0.5">
            {socials.map(({ network, href }) => {
              const Icon = socialIcons[network];
              const label = socialLabels[network];

              return (
                <li key={network}>
                  <SocialIconLink href={href} label={label} Icon={Icon} />
                </li>
              );
            })}
          </ul>
        </nav>
        <EmailLink email={email} copyable={emailCopyable} />
      </div>
    </header>
  );
}

function NameAndJobTitle() {
  const { locale } = useLocale();
  const t = useTranslations();
  const name = me.name;
  const jobTitle = profileFor(locale).jobTitle;

  return (
    <section
      aria-labelledby="profile-name"
      className="relative flex w-full flex-col py-4"
    >
      <GridLineH className="top-0" />
      <GridIntersection corner="top-left" />
      <GridIntersection corner="top-right" />
      <h1
        id="profile-name"
        className="text-display font-display tracking-display text-balance text-foreground"
      >
        {name || t("profile.nameUnavailable")}
      </h1>
      <p className="mt-1.75 text-role font-book tracking-role text-balance text-muted-foreground">
        {jobTitle || t("profile.jobTitleUnavailable")}
      </p>
      <GridLineH className="bottom-0" />
      <GridIntersection corner="bottom-left" />
      <GridIntersection corner="bottom-right" />
    </section>
  );
}

export function PortfolioPage({
  avatarUrl,
  email,
  emailCopyable = false,
  socials,
  skillGroups,
}: PortfolioPageProps) {
  return (
    <FolioShell>
      <Header
        avatarUrl={avatarUrl}
        email={email}
        emailCopyable={emailCopyable}
        socials={socials}
      />
      <NameAndJobTitle />
      <AboutBio />
      <GithubContributions />
      <Skills groups={skillGroups} />
      <Hobbies />
    </FolioShell>
  );
}
