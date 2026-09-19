import { NextResponse } from "next/server";
import { isLocale } from "@/lib/locale";
import { me, metaFor, profileFor } from "@/lib/site";
import { originFromRequest } from "@/lib/site/origin";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ locale: string }> },
) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) {
    return new NextResponse(null, { status: 404 });
  }

  const origin = originFromRequest(request);
  const profile = profileFor(raw);
  const meta = metaFor(raw);

  return NextResponse.json({
    locale: raw,
    url: `${origin}/${raw}`,
    meta: {
      title: `Portfolio — ${me.name}`,
      description: meta.home.description,
    },
    person: {
      name: me.name,
      handle: me.handle,
      email: me.emails.map((email) => email.address),
      jobTitle: profile.jobTitle,
      tagline: profile.tagline,
      about: profile.about,
    },
    skills: {
      groups: me.skills,
    },
    hobbies: {
      url: `${origin}/${raw}/hobby`,
    },
    socials: me.socials.portfolio,
  });
}
