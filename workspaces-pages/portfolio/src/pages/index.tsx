import React from 'react';
import Card from '../components/card';
import SwitchTheme from '../components/switch-theme';
import ButtonSocial from '../components/social-button';

import type { NextPage } from 'next';
import type { SocialType } from '../components/social-button';
import Head from 'next/head';

const socialLinks: Array<{
    name: SocialType;
    link: string;
}> = [
    {
        name: 'github',
        link: 'https://www.github.com/eubyt',
    },
    {
        name: 'linkedin',
        link: 'https://www.linkedin.com/in/eubyt',
    },
    {
        name: 'twitter',
        link: 'https://www.twitter.com/eubyt',
    },
    {
        name: 'instagram',
        link: 'https://www.instagram.com/eubyt',
    },
];

const Home: NextPage = () => (
    <>
        <Head>
            <title>eubyt (Adrian César) | About</title>
        </Head>

        <div className="absolute flex w-screen flex-col items-end p-6">
            <SwitchTheme />
        </div>

        <div className="flex h-screen w-screen items-center justify-center">
            <Card className="m-6 flex max-w-screen-md flex-col space-y-6">
                <div className="flex flex-col text-center">
                    <h1 className="text-2xl font-bold text-zinc-800 dark:text-white">
                        Olá, eu sou o Adrian CF 👋
                    </h1>
                    <p className="text-zinc-800 dark:text-white">
                        Sou um desenvolvedor web fullstack, também conhecido como{' '}
                        <i className="text-zinc-900 dark:text-yellow-400">eubyt</i> pela internet.
                    </p>
                </div>

                <div className="flex flex-col">
                    <h2 className="text-xl font-bold text-zinc-800 dark:text-white">Tecnologias</h2>
                    <p className="text-zinc-800 dark:text-white">
                        Eu uso principalmente{' '}
                        <i className="text-zinc-900 dark:text-yellow-400">Next.Js</i> ou{' '}
                        <i className="text-zinc-900 dark:text-yellow-400">React.Js</i> para
                        desenvolver aplicações web mas também tenho experiência com{' '}
                        <i>Node.Js, Typescript, MongoDB, MySQL e entre outros</i>.
                    </p>
                </div>

                <div className="flex flex-col">
                    <h2 className="text-xl font-bold text-zinc-800 dark:text-white">IDE ☕</h2>
                    <p className="text-zinc-800 dark:text-white">
                        Eu uso principalmente{' '}
                        <i className="text-zinc-900 dark:text-yellow-400">VSCode</i> para
                        desenvolver
                    </p>
                </div>

                <div className="flex justify-center">
                    {socialLinks.map((social) => (
                        <div className="mr-2" key={social.link}>
                            <ButtonSocial type={social.name} link={social.link} />
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    </>
);

export default Home;
