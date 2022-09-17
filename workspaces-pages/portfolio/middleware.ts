import { NextRequest, NextResponse } from 'next/server';

export const config = {
    matcher: ['/', '/_subdomains/:path'],
};

const getHostnameDataBySubdomain = (subdomain: string | false | undefined) => {
    switch (subdomain) {
        case 'other':
            return {
                pathName: 'other.eubyt.dev',
            };
        default:
            return null;
    }
};

export default async function middleware(req: NextRequest) {
    const url = req.nextUrl;

    const hostname = req.headers.get('host');
    const currentHost =
        process.env.NODE_ENV === 'production' &&
        hostname?.replace(`.${process.env.ROOT_DOMAIN}`, '');

    const hostnameData = getHostnameDataBySubdomain(currentHost);

    if (hostnameData) {
        if (url.pathname.startsWith(`/_subdomains`)) {
            url.pathname = `/404`;
        } else {
            console.log('URL 2', req.nextUrl.href);
            url.pathname = `/_subdomains/${hostnameData.pathName}${url.pathname}`;
        }
    }

    return NextResponse.rewrite(url);
}
