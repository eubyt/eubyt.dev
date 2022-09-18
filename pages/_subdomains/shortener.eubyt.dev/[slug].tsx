import React from 'react';
import type { GetServerSideProps } from 'next';

const Redirect = ({ slug }: { slug: string }) => <div>{slug}</div>;

const getServerSideProps: GetServerSideProps<{
    slug: string;
}> = async (context) => {
    const { slug } = context.params as { slug: string };
    const response = context.res;

    response.writeHead(301, {
        Location: `https://eubyt.dev/${slug}`,
    });

    response.end();

    return {
        props: {
            slug,
        },
    };
};

export { getServerSideProps };
export default Redirect;
