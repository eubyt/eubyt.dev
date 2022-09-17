import React from 'react';
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
    return (
        <Html>
            <Head />
            <body className="dark:bg-alt-black bg-white">
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
