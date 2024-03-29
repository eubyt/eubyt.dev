import React from 'react';
import type { AppProps } from 'next/app';
import '../styles/main.css';
import Script from 'next/script';
import Head from 'next/head';

const App = ({ Component, pageProps }: AppProps) => {
    const googleAnalyticsId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
    const googleAdsense = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE;

    return (
        <>
            <Head>
                <script
                    async
                    data-ad-client={googleAdsense}
                    src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
                    crossOrigin="anonymous"
                ></script>
            </Head>

            {googleAnalyticsId && (
                <>
                    <Script
                        data-website-id={googleAnalyticsId}
                        src={`https://www.googletagmanager.com/gtag/js`}
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
            <Component {...pageProps} />
        </>
    );
};

export default App;
