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
        link: 'https://www.linkedin.com/in/adrian.cesar',
    },
    {
        name: 'twitter',
        link: 'https://www.twitter.com/eubyt',
    },
    {
        name: 'instagram',
        link: 'https://www.instagram.com/eubyt',
    },
    {
        name: 'keybase',
        link: 'https://www.keybase.io/eubyt',
    },
];

const Home: NextPage = () => (
    <>
        <Head>
            <title>eubyt (Adrian César) | About</title>
        </Head>

        <div className="flex w-screen flex-col items-end p-6 xl:absolute">
            <SwitchTheme />
        </div>

        <div className="flex h-screen w-screen flex-col items-center xl:justify-center">
            <div className="max-w-screen-md md:m-6 space-y-6">
                <Card className="flex max-w-screen-md flex-col space-y-6 md:rounded-lg">
                    <div className="flex flex-col text-center">
                        <h1 className="text-2xl font-bold text-zinc-800 dark:text-white">
                            Olá, eu sou o Adrian CF 👋
                        </h1>
                        <p className="text-zinc-800 dark:text-white">
                            Sou um desenvolvedor web fullstack, também conhecido como{' '}
                            <i className="text-zinc-900 dark:text-yellow-400">eubyt</i> pela
                            internet.
                        </p>
                    </div>
                    <div className="flex flex-col">
                        <h2 className="text-xl font-bold text-zinc-800 dark:text-white">
                            Tecnologias
                        </h2>
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
                            desenvolver.
                        </p>
                    </div>
                    <div className="flex justify-center">
                        {socialLinks.map((social) => (
                            <div className="mr-2" key={social.link}>
                                <ButtonSocial type={social.name} link={social.link} />
                            </div>
                        ))}
                    </div>
                    <div className="text-center">
                        <div className="text-sm text-zinc-800 dark:text-white">
                            <a
                                href="https://keybase.io/eubyt/key.asc"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:underline"
                                title={`Chave pública do eubyt`}
                            >
                                Key PGP
                            </a>{' '}
                            <span className="text-sm text-zinc-800 dark:text-white">|</span>{' '}
                            <a
                                href="https://keybase.io/eubyt/pgp_keys.asc"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:underline"
                                title={`Todas as chaves públicas do eubyt`}
                            >
                                List All Keys PGP
                            </a>
                        </div>
                        <div className="text-sm text-zinc-800 dark:text-white">
                            Se você não sabe como criptografar usando PGP acesse o{' '}
                            <a
                                href="https://keybase.io/encrypt#eubyt"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-zinc-900 hover:underline dark:text-yellow-400"
                                title={`Site do keybase para criptografar mensagens`}
                            >
                                Keybase
                            </a>
                            .
                        </div>
                    </div>
                </Card>
                <Card className="flex flex-col space-y-6 md:rounded-lg">
                    <div className="flex flex-col text-center">
                        <h1 className="text-2xl font-bold  text-zinc-800 dark:text-white">
                            📙 Lista de projetos 📙
                        </h1>
                        <p className="text-zinc-800 dark:text-white">
                            Aqui estão alguns dos meus projetos pessoais.
                        </p>
                    </div>
                    <a
                        className="flex flex-col text-zinc-800 dark:text-white"
                        href="https://keybase.io/encrypt#eubyt"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <h2 className="text-xl font-bold">Encurtador de URL</h2>
                        <p className="text-zinc-800 dark:text-white">
                            Um encurtador de URL simples feito com Next.Js e MongoDB.
                        </p>
                    </a>
                </Card>
            </div>
        </div>
    </>
);

export default Home;
