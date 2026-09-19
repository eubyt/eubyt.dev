import type { IconType } from "react-icons";
import {
  FaDiscord,
  FaGithub,
  FaInstagram,
  FaLinkedinIn,
  FaSteam,
  FaTwitch,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";

export const socialIcons = {
  linkedin: FaLinkedinIn,
  github: FaGithub,
  instagram: FaInstagram,
  discord: FaDiscord,
  twitter: FaXTwitter,
  twitch: FaTwitch,
  youtube: FaYoutube,
  steam: FaSteam,
} as const satisfies Record<string, IconType>;

export type SocialNetwork = keyof typeof socialIcons;

export const socialLabels = {
  linkedin: "LinkedIn",
  github: "GitHub",
  instagram: "Instagram",
  discord: "Discord",
  twitter: "Twitter",
  twitch: "Twitch",
  youtube: "YouTube",
  steam: "Steam",
} as const satisfies Record<SocialNetwork, string>;

export type SocialLink = {
  network: SocialNetwork;
  href: string;
};
