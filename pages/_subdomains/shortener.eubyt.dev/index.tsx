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

const Shortener = () => {
    const [alias, setAlias] = React.useState<string | undefined>(undefined);
    const [loading, setLoading] = React.useState<boolean>(false);

    const copyToClipboard = (text: string) => {
        void navigator.clipboard.writeText(text);
    };

    const handlerShortener = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (alias !== undefined) {
            copyToClipboard(alias);
            return;
        }

        const form = e.currentTarget;
        const url = form.url.value as string;
        if (!url || loading) return;

        setLoading(true);

        const apiShortener = `${
            process.env.NEXT_PUBLIC_HOST ?? 'http://localhost:3000'
        }/api/url_shortener`;

        const request = await fetch(apiShortener, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                url,
            }),
        });

        const { data } = (await request.json()) as {
            message: string;
            data: {
                url: string;
                alias: string;
            };
        };

        if (data?.alias) {
            setAlias(`https://eub.yt/${data.alias}`);
            setLoading(false);
        }
    };

    const ButtonShortener = ({ copy }: { copy: boolean }) => (
        <>
            {copy ? (
                <button
                    title="Clique para copiar o URL encurtado."
                    type="submit"
                    className="w-56 cursor-pointer rounded-md bg-zinc-200 py-4 text-zinc-800 hover:bg-gray-300 dark:bg-stone-800 dark:text-white dark:hover:bg-stone-600"
                >
                    Copiar
                </button>
            ) : (
                <button
                    title="Clique para encurtar a URL."
                    type="submit"
                    className="w-56 cursor-pointer rounded-md bg-zinc-200 py-4 text-zinc-800 hover:bg-gray-300 dark:bg-stone-800 dark:text-white dark:hover:bg-stone-600"
                >
                    Encurtar
                </button>
            )}
        </>
    );

    return (
        <>
            <ThemeContextProvider>
                <Head>
                    <title>URL Shortener (eub.yt)</title>
                </Head>
                <ButtonSwitchTheme />
                <div className="flex min-h-screen flex-col items-center xl:justify-center">
                    <form className="max-w-screen-md space-y-6 md:m-6" onSubmit={handlerShortener}>
                        <Card className="max-w-screen-md md:rounded-lg">
                            <div className="text-center">
                                <h1 className="text-2xl font-bold text-zinc-800 dark:text-white">
                                    URL Shortener | eub.yt 🔗
                                </h1>
                                <p className="text-zinc-800 dark:text-white">
                                    This is a URL shortener made by me, it is still in development,
                                    but you can already use it.
                                </p>
                            </div>
                        </Card>
                        <Card className="max-w-screen-md md:rounded-lg">
                            <div
                                className="rounded-md bg-zinc-200 px-4 dark:bg-stone-800"
                                onClick={() => {
                                    if (alias !== undefined) {
                                        copyToClipboard(alias);
                                    }
                                }}
                            >
                                {alias ? (
                                    <p className="cursor-pointer py-4 text-zinc-800 dark:text-white">
                                        {alias}
                                    </p>
                                ) : (
                                    <input
                                        type="text"
                                        name="url"
                                        placeholder="URL do site que deseja encurtar."
                                        autoComplete="off"
                                        title="Coloque a URL do site que deseja encurtar."
                                        disabled={loading || alias !== undefined}
                                        className="w-full rounded-md bg-zinc-200 py-4 text-zinc-800 focus:border-transparent focus:bg-transparent focus:outline-none dark:bg-stone-800 dark:text-white"
                                    />
                                )}
                            </div>
                            <div>
                                {alias && (
                                    <button
                                        title="Clique para encurtar a URL."
                                        onClick={() => {
                                            window.location.reload();
                                        }}
                                        className="mt-6 w-full cursor-pointer rounded-md bg-zinc-200 py-4 text-zinc-800 hover:bg-gray-300 dark:bg-stone-800 dark:text-white dark:hover:bg-stone-600"
                                    >
                                        Criar novo link
                                    </button>
                                )}
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
                                {loading ? (
                                    <div className="w-56 rounded-md bg-gray-300 py-4 text-center text-zinc-800 dark:bg-stone-600 dark:text-white ">
                                        Encurtando...
                                    </div>
                                ) : (
                                    <ButtonShortener copy={Boolean(alias)} />
                                )}
                            </div>
                        </Card>
                    </form>
                </div>
            </ThemeContextProvider>
        </>
    );
};

export default Shortener;
