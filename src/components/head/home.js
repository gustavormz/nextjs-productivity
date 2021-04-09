import Head from 'next/head';

const HeadHome = () => (
    <Head>
        <title>
            { process.env.APP_NAME } | Home
        </title>
    </Head>
);

export default HeadHome;
