import React from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';

// Bem vindo ao limbo
const Home: NextPage = () => (
    <>
        <Head>
            <title>Limbo...</title>
        </Head>
        <div className="flex h-screen w-screen items-center justify-center">
            <div className="m-6 flex max-w-screen-md flex-col space-y-6">
                <div className="flex flex-col text-center">
                    <h1 className="text-2xl font-bold text-zinc-800">Você está no limbo!</h1>
                    <p className="text-zinc-800">Você não deveria estar aqui...</p>
                </div>
            </div>
        </div>
    </>
);

export default Home;
