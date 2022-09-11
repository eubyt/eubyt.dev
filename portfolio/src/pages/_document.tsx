import React from 'react';
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
    return (
        <Html>
            <Head />
            <body className="bg-white dark:bg-alt-black">
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
