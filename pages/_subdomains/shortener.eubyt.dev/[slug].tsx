import React from 'react';
import type { GetServerSideProps } from 'next';

const Redirect = ({ slug }: { slug: string }) => <div>{slug}</div>;

const getServerSideProps: GetServerSideProps<{
    slug: string;
}> = async (context) => {
    const { req, query, res, params } = context;
    const { slug } = params as { slug: string };
    const domain = process.env.NEXT_PUBLIC_HOST ?? 'http://localhost:3000';

    const getUrl = await fetch(`${domain}/api/url_shortener?alias=${slug}`);
    const { data } = (await getUrl.json()) as {
        message: string;
        data: {
            url: string;
            alias: string;
        };
    };

    if (data?.url) {
        res.writeHead(301, {
            Location: data.url,
        });
    } else {
        res.writeHead(404);
    }

    res.end();
    return {
        props: {
            slug,
        },
    };
};

export { getServerSideProps };
export default Redirect;
