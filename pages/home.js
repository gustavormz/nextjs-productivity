import {
    useState,
    useEffect
} from 'react';

import Head from '../src/components/head/home';
import LayoutBase from '../src/components/layout/base';
import Page from '../src/pages/home/page';
import Static from '../src/pages/home/static';

const Home = () => {
    const [task, setTask] = useState(undefined);
    
    useEffect(() => {
        async function getAllTask () {

        }

        getAllTask();
    }, []);

    return (
        <LayoutBase>
            <Head />
            { task ? (
                <Page />
            ) : (
                <Static />
            ) }
        </LayoutBase>
    );
};

export default Home;