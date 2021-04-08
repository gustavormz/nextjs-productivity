import Head from 'next/head';

const HeadHome = () => (
    <Head>
        <title>
            { process.env.REACT_APP_NAME } | Home
        </title>
    </Head>
);

export default HeadHome;
