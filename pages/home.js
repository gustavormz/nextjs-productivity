import PropTypes from 'prop-types';
import {
    useState,
    useEffect
} from 'react';

import Head from '../src/components/head/home';
import LayoutBase from '../src/components/layout/base';
import Page from '../src/pages/home/page';
import Static from '../src/pages/home/static';

const Home = ({
    endpoint
}) => {
    const [tasks, setTasks] = useState(undefined);
    
    useEffect(() => {
        async function getAllTasks () {
            const response = await (await fetch(endpoint)).json();
            console.log(response);
            const taskToSet = response.error ? [] : response.data.Items;
            setTasks(taskToSet);
        }
        getAllTasks();
    }, []);

    return (
        <LayoutBase>
            <Head />
            { tasks ? (
                <Page
                    tasks={tasks}/>
            ) : (
                <Static />
            ) }
        </LayoutBase>
    );
};

export const getServerSideProps = () => {
    const endpoint = `/api/task`;

    return {
        props: {
            endpoint
        }
    };
};

Home.propTypes = {
    endpoint: PropTypes.string
};

export default Home;
