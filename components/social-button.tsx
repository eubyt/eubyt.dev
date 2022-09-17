import React from 'react';
import {
    FaGithub,
    FaLinkedin,
    FaTwitter,
    FaInstagram,
    FaEnvelope,
    FaDiscord,
    FaTelegram,
    FaKeybase,
} from 'react-icons/fa';
import type { SocialType } from '@config/eubyt-info';

const icon = {
    github: <FaGithub />,
    linkedin: <FaLinkedin />,
    twitter: <FaTwitter />,
    instagram: <FaInstagram />,
    email: <FaEnvelope />,
    discord: <FaDiscord />,
    telegram: <FaTelegram />,
    keybase: <FaKeybase />,
};

const ButtonSocial = (social: { type: SocialType; link: string }) => (
    <>
        <a
            href={social.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-14 w-14 items-center justify-center rounded-full hover:bg-gray-300 dark:hover:bg-stone-600"
            title={`Link para o meu perfil no ${social.type}`}
        >
            <span className="text-4xl text-zinc-800 dark:text-white">{icon[social.type]}</span>
        </a>
    </>
);

export default ButtonSocial;
export type { SocialType };
