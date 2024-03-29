import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

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

export const config = {
    matcher: ['/', '/([a-zA-Z0-9]+)', '/_subdomains/:path'],
};

export async function middleware(req: NextRequest) {
    const url = req.nextUrl;
    const hostList = (req.headers.get('host') ?? 'localhost').split('.');
    const domainName = hostList.length > 2 ? hostList[1] : hostList[0];
    const subdomain = hostList.length > 2 ? hostList[0] : false;

    if (process.env.NODE_ENV.toLowerCase() !== 'production') {
        return NextResponse.next();
    }

    console.log({
        subdomain,
        domainName,
        href: req.nextUrl.href,
        pathname: url.pathname,
    });

    if (url.pathname.startsWith(`/_subdomains`) || url.pathname.startsWith(`/index`)) {
        url.pathname = `/404`;
        return NextResponse.rewrite(url);
    }

    switch (domainName) {
        case 'eubyt':
            if (subdomain && redirectConfig[subdomain]) {
                url.pathname = `/_subdomains/${redirectConfig[subdomain].pathName}${url.pathname}`;
            }

            break;
        case 'eub':
            url.pathname = `/_subdomains/${redirectConfig.shortener.pathName}${url.pathname}`;

            break;
        default:
            return NextResponse.next();
    }

    return NextResponse.rewrite(url);
}
