import Head from 'next/head';

const HeadIndex = () => (
    <Head>
        <title>
            { process.env.REACT_APP_NAME }
        </title>
    </Head>
);

export default HeadIndex;
