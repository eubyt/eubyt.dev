import React, { useEffect } from 'react';
import type { AppProps } from 'next/app';
import { ThemeContextProvider } from '../context/theme-color';
import '../styles/main.css';
import Script from 'next/script';

function MyApp({ Component, pageProps }: AppProps) {
    const googleAnalyticsId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
    return (
        <>
            {googleAnalyticsId && (
                <>
                    <Script
                        src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
                        strategy="afterInteractive"
                    />
                    <Script id="google-analytics" strategy="afterInteractive">
                        {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){window.dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${googleAnalyticsId}');
                `}
                    </Script>
                </>
            )}

            <ThemeContextProvider>
                <Component {...pageProps} />
            </ThemeContextProvider>
        </>
    );
}

export default MyApp;
