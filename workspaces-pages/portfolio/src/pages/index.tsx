import React from 'react';
import type { NextPage } from 'next';
import Card from '../components/card';
import SwitchTheme from '../components/switch-theme';

const Home: NextPage = () => (
    <>
        <div className="absolute flex w-screen flex-col items-end p-6">
            <SwitchTheme />
        </div>
        <div className="flex h-screen w-screen items-center justify-center">
            <Card>
                <h1 className="text-xl font-bold text-zinc-800 dark:text-white">Hello world!</h1>
            </Card>
        </div>
    </>
);

export default Home;
