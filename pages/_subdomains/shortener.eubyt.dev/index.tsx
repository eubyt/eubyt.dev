import Head from 'next/head';
import React from 'react';
import { ThemeContextProvider } from '../../../context/theme-color';
import SwitchTheme from '../../../components/switch-theme';
import Card from '../../../components/card';

const ButtonSwitchTheme = () => (
    <div className="flex w-full flex-col items-end p-6 xl:absolute">
        <SwitchTheme />
    </div>
);

const Shortener = () => (
    <>
        <ThemeContextProvider>
            <Head>
                <title>URL Shortener (eub.yt)</title>
            </Head>
            <ButtonSwitchTheme />
            <div className="flex min-h-screen flex-col items-center xl:justify-center">
                <div className="max-w-screen-md space-y-6 md:m-6">
                    <Card className="max-w-screen-md md:rounded-lg">
                        <div className="text-center">
                            <h1 className="text-2xl font-bold text-zinc-800 dark:text-white">
                                URL Shortener | eub.yt 🔗
                            </h1>
                            <p className="text-zinc-800 dark:text-white">
                                This is a URL shortener made by me, it is still in development, but
                                you can already use it.
                            </p>
                        </div>
                    </Card>
                    <Card className="max-w-screen-md md:rounded-lg">
                        <div className="text-center">
                            <div className="rounded-md bg-zinc-200 px-4 dark:bg-stone-800">
                                <input
                                    type="text"
                                    placeholder="URL do site que deseja encurtar."
                                    autoComplete="off"
                                    title="Coloque a URL do site que deseja encurtar."
                                    className="w-full rounded-md bg-zinc-200 py-4 text-zinc-800 focus:border-transparent focus:bg-transparent focus:outline-none dark:bg-stone-800 dark:text-white"
                                />
                            </div>
                        </div>
                    </Card>

                    <Card className="max-w-screen-md md:rounded-lg">
                        <div className="flex flex-col-reverse items-center md:flex-row md:justify-between">
                            <span className="mt-6 text-sm text-zinc-800 dark:text-white md:mt-0">
                                Desenvolvido por{' '}
                                <a
                                    title="Visite o perfil do desenvolvedor (eubyt)."
                                    href="https://eubyt.dev"
                                    className="text-zinc-900 hover:underline dark:text-yellow-400"
                                >
                                    eubyt
                                </a>{' '}
                                ❣️
                            </span>
                            <button
                                title="Clique para encurtar a URL."
                                className="w-56 rounded-md bg-zinc-200 py-4 text-zinc-800 hover:bg-gray-300 dark:bg-stone-800 dark:text-white dark:hover:bg-stone-600"
                            >
                                Encurtar
                            </button>
                        </div>
                    </Card>
                </div>
            </div>
        </ThemeContextProvider>
    </>
);

export default Shortener;
