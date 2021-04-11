import {
    useState
} from 'react';

import Head from '../src/components/head/home'; // page title name
import LayoutBase from '../src/components/layout/base';
import TabPanelTasks from '../src/components/tabPanel/tasks';
import TabPanelPerformance from '../src/components/tabPanel/performance';

const Home = () => {
    // manage drawer state to show between tasks and performance views
    const [state, setState] = useState({
        drawerTabActive: 0
    });

    function handleDrawerTabChange (event, index) {
        setState({
            ...state,
            drawerTabActive: index
        });
    }

    return (
        <LayoutBase    
            handleTabChange={handleDrawerTabChange}
            tabActive={state.drawerTabActive}
            maxWidth={'md'}>
            <Head />
            <TabPanelTasks
                callApi={state.drawerTabActive === 0}
                role="tabpanel"
                hidden={state.drawerTabActive !== 0}
                id={`drawer-nav-tabpanel-0`}
                aria-labelledby={`drawer-nav-tab-0`}/>
            <TabPanelPerformance
                callApi={state.drawerTabActive === 1}
                role="tabpanel"
                hidden={state.drawerTabActive !== 1}
                id={`drawer-nav-tabpanel-1`}
                aria-labelledby={`drawer-nav-tab-1`}/>
        </LayoutBase>
    );
};

export default Home;
