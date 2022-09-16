import React from 'react';
import type { AppProps } from 'next/app';
import '../styles/main.css';
import Script from 'next/script';

function MyApp({ Component, pageProps }: AppProps) {
    const googleAnalyticsId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
    const googleAdsense = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE;

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
                    gtag('config', '${googleAnalyticsId}', {
                        'cookie_domain': 'other.eubyt.dev',
                    });
                `}
                    </Script>
                </>
            )}
            {googleAdsense && (
                <Script
                    async
                    src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${googleAdsense}`}
                    strategy="afterInteractive"
                    crossOrigin="anonymous"
                />
            )}
            <Component {...pageProps} />
        </>
    );
}

export default MyApp;
