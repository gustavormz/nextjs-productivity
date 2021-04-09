import Head from 'next/head';

const HeadIndex = () => (
    <Head>
        <title>
            { process.env.APP_NAME }
        </title>
    </Head>
);

export default HeadIndex;
