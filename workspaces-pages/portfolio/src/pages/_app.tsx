import React from 'react';
import type { AppProps } from 'next/app';
import { ThemeContextProvider } from '../context/theme-color';
import '../styles/main.css';

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <ThemeContextProvider>
            <Component {...pageProps} />
        </ThemeContextProvider>
    );
}

export default MyApp;
