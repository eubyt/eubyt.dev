import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export const config = {
    matcher: ['/_subdomains/:path'],
};

export default async function middleware(req: NextRequest) {
    const url = req.nextUrl;

    if (process.env.NODE_ENV.toLowerCase() !== 'production') {
        return NextResponse.next();
    }

    const hostList = (req.headers.get('host') ?? 'localhost').split('.');
    const domainName = hostList.length > 2 ? hostList[1] : hostList[0];
    const subdomain = hostList.length > 2 ? hostList[0] : false;

    const redirectConfig: Record<
        string,
        {
            pathName: string;
        }
    > = {
        shortener: {
            pathName: 'shortener.eubyt.dev',
        },
        other: {
            pathName: 'other.eubyt.dev',
        },
    };

    console.log(hostList, domainName, subdomain);
    console.log('redirectConfig[domainName]', redirectConfig[domainName]);
    console.log('redirectConfig[domainName].pathName', redirectConfig[domainName].pathName);

    if (url.pathname.startsWith(`/_subdomains`) || url.pathname.startsWith(`/index`)) {
        url.pathname = `/404`;
        return NextResponse.rewrite(url);
    }

    switch (domainName) {
        case 'eubyt':
            if (subdomain && redirectConfig[subdomain]) {
                console.log('eubyt.dev >> ', req.nextUrl.href);
                url.pathname = `/_subdomains/${redirectConfig[subdomain].pathName}${url.pathname}`;
            }

            break;
        case 'eub.yt':
            console.log('eub.yt >> ', req.nextUrl.href);
            url.pathname = `/_subdomains/${redirectConfig.shortener.pathName}${url.pathname}`;

            break;
        default:
            return NextResponse.next();
    }

    return NextResponse.rewrite(url);
}