import PropTypes from 'prop-types';
import {
    Grid,
    Hidden,
    RootRef,
    List,
    withStyles
} from '@material-ui/core';
import {
    DragDropContext,
    Droppable,
    Draggable
} from 'react-beautiful-dnd';

import TypographyTitle from '../../components/typography/title';
import ButtonSecondary from '../../components/ui/button/secondary';
import DividerBase from '../../components/divider/base';
import SimpleWrapperText from '../../components/paper/simpleWrapperText';
import ButtonBase from '../../components/ui/button/base';
import ListItemTask from '../../components/list/item/task';
import TimekeeperBase from '../../components/timekeeper/base';
import TabBase from '../../components/tab/base';
import TabsBase from '../../components/tabs/base';
import SelectTaskDefaultDuration from '../../components/ui/select/task/defaultDuration';
import TabPanelTaskPending from '../../components/tabPanel/task/pending';

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

const getItemStyle = (isDragging, draggableStyle) => ({
    ...draggableStyle,

    // styles when drag item
    ...(isDragging && {
        background: "rgb(235,235,235)"
    })
});

const gridTimekeeperStyles = theme => ({
    container: {
        [theme.breakpoints.down('md')]: {
            justifyContent: `center`
        }
    }
});

const GridTimekeeperContainer = withStyles(gridTimekeeperStyles)(Grid);

const HomePage = ({
    tabActive,
    handleTabChange
}) => {
    return (
        <Grid container spacing={4}>
            <Grid item xs={12}/>
            <Grid item xs={12}>
                <TypographyTitle>
                    Home
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
                role="tabpanel"
                hidden={tabActive !== 0}
                id={`nav-tabpanel-0`}
                aria-labelledby={`nav-tab-0`}/>
        </Grid>
    ); 
};

HomePage.propTypes = {
    tasks: PropTypes.array,
    durations: PropTypes.array,
    handleNewTaskButtonClick: PropTypes.func,
    handleEditClick: PropTypes.func,
    handleDeleteClick: PropTypes.func,
    onDragEnd: PropTypes.func,
    handleTimekeeperFinish: PropTypes.func,
    handleFinishClick: PropTypes.func,
    tabActive: PropTypes.number,
    handleTabChange: PropTypes.func,
    selectTaskDuration: PropTypes.string,
    handleSelectTaskDuration: PropTypes.func,
    baseApiUrl: PropTypes.string
};

HomePage.defaultProps = {
    selectTaskDuration: `ALL`
};

export default HomePage;
