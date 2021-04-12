import {
    useState
} from 'react';
import {
    Grid
} from '@material-ui/core';

import TypographyTitle from '../typography/title';
import TabsBase from '../tabs/base';
import TabBase from '../tab/base';
import TabPanelTaskPending from '../tabPanel/task/pending';
import TabPanelTaskFinished from '../tabPanel/task/finished';

const linkTabProps = index => ({
    id: `nav-tab-${index}`,
    'aria-controls': `nav-tabpanel-${index}`
});

const LinkTab = props => (
    <TabBase
        { ...props }
        component={'a'}
        onClick={event => {
            event.preventDefault();
        }}/>
);

const TabPaneTasks = props => {
    const [tabActive, setTabActive] = useState(0);

    function handleTabChange (event, index) {
        setTabActive(index);
    }

    return (
        <div
            style={{
                width: `100%`,
                padding: 10,
            }}
            {...props}>
            <Grid container spacing={4}>
                <Grid item xs={12}/>
                <Grid item xs={12}>
                    <TypographyTitle>
                        Tareas
                    </TypographyTitle>
                </Grid>
                <Grid item xs={12}>
                    <TabsBase
                        onChange={handleTabChange}
                        value={tabActive}
                        centered>
                        <LinkTab
                            { ...linkTabProps (0) }
                            href="/pending" 
                            label={`Pendientes`} />
                        <LinkTab
                            { ...linkTabProps (1) }
                            href="/finished"
                            label={`Finalizadas`}/>
                    </TabsBase>
                </Grid>
                <TabPanelTaskPending
                    callapi={tabActive === 0}
                    role="tabpanel"
                    hidden={tabActive !== 0}
                    id={`nav-tabpanel-0`}
                    aria-labelledby={`nav-tab-0`}/>
                <TabPanelTaskFinished
                    callapi={tabActive === 1}
                    role={'tabpanel'}
                    hidden={tabActive !== 1}
                    id={`nav-tabpanel-1`}
                    aria-labelledby={`nav-tab-1`}/>
            </Grid>
        </div>
    );
};

export default TabPaneTasks;
