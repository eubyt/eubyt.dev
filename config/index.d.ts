export type SocialType =
    | 'github'
    | 'linkedin'
    | 'twitter'
    | 'instagram'
    | 'email'
    | 'discord'
    | 'telegram'
    | 'keybase';

export const social: Array<{
    name: SocialType;
    link: string;
}>;
