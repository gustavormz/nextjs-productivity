import {
    useState
} from 'react';
import {
    ThemeProvider,
    createMuiTheme
} from '@material-ui/core/styles';

import Head from '../src/components/head/home'; // page title name
import LayoutBase from '../src/components/layout/base';
import TabPanelTasks from '../src/components/tabPanel/tasks';
import TabPanelPerformance from '../src/components/tabPanel/performance';

const theme = createMuiTheme({
    palette: {
        primary: {
            light: '#428488',
            main: '#07575b',
            dark: '#002d32'
        },
        secondary: {
            light: '#f7ffff',
            main: '#c4dfe6',
            dark: '#93adb4'
        },
        action: {
            active: '#002d32',
            hover: '#428488',
            selected: '#07575b',
            focus: '#cabf45',
        }
    },
    overrides: {
        MuiFormControl: {
            root: {
                '& .MuiOutlinedInput-notchedOutline' : {
                    borderColor: `#002d32`
                }
            }
        }
    }
});

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
        <ThemeProvider theme={theme}>
            <LayoutBase    
                handleTabChange={handleDrawerTabChange}
                tabActive={state.drawerTabActive}
                maxWidth={'md'}>
                <Head />
                <TabPanelTasks
                    role="tabpanel"
                    hidden={state.drawerTabActive !== 0}
                    id={`drawer-nav-tabpanel-0`}
                    aria-labelledby={`drawer-nav-tab-0`}/>
                <TabPanelPerformance
                    role="tabpanel"
                    hidden={state.drawerTabActive !== 1}
                    id={`drawer-nav-tabpanel-1`}
                    aria-labelledby={`drawer-nav-tab-1`}/>
            </LayoutBase>
        </ThemeProvider>
    );
};

export default Home;
