import Head from 'next/head';
import React from 'react';
import Card from '../../components/card';
import Input from '../../components/input';
import SwitchTheme from '../../components/switch-theme';
import { ThemeContextProvider } from '../../context/theme-color';

const ButtonSwitchTheme = () => (
    <div className="flex w-full flex-col items-end p-6 xl:absolute">
        <SwitchTheme />
    </div>
);

const ToolUser = () => (
    <>
        <ThemeContextProvider>
            <Head>
                <title>eubyt (Adrian César) | About</title>
                <meta
                    name="description"
                    content="Olá, eu sou o Adrian CF. Sou um desenvolvedor full-stack web e você está em meu site pessoal."
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <ButtonSwitchTheme />
            <div className="flex min-h-screen flex-col items-center xl:justify-center">
                <main className="max-w-screen-md space-y-6 md:m-6">
                    <div className="flex flex-col items-center">
                        <Card className="flex flex-col space-y-6 md:rounded-lg">
                            <div className="flex flex-col text-center">
                                <h1 className="text-2xl font-bold  text-zinc-800 dark:text-white">
                                    🛠️ Twitch Tools 🛠️
                                </h1>
                                <p className="py-2 text-zinc-800 dark:text-white">
                                    Kit de ferramentas para Twitch
                                </p>
                            </div>
                        </Card>
                    </div>
                    <Card className="flex flex-col space-y-6 md:rounded-lg">
                        <article className="flex flex-col">
                            <h2 className="text-xl font-bold text-zinc-800 dark:text-white">
                                Converter Twitch Username para Channel ID
                            </h2>
                            <div className="mt-6 rounded-md bg-zinc-200 px-4 dark:bg-stone-800">
                                <Input
                                    title="Twitch Username"
                                    placeholder="eubyt"
                                    name="username"
                                />
                            </div>
                        </article>
                    </Card>
                </main>
            </div>
        </ThemeContextProvider>
    </>
);

export default ToolUser;
