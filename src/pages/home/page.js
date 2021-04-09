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
    tasks,
    handleNewTaskButtonClick,
    durations,
    handleEditClick,
    handleDeleteClick,
    onDragEnd,
    handleTimekeeperFinish
}) => (
    <Grid container spacing={4}>
        <Grid item xs={12}/>
        <Grid item xs={12}>
            <TypographyTitle>
                Home
            </TypographyTitle>
        </Grid>
        <GridTimekeeperContainer
            container
            item
            xs={12}
            md={7}>
            <TimekeeperBase
                handleFinishCount={handleTimekeeperFinish}
                initialTime={10}/>
        </GridTimekeeperContainer>
        <Grid
            container
            alignItems={'flex-end'}
            item xs={12} md={5}>
            <ButtonSecondary onClick={handleNewTaskButtonClick}>
                Agregar Nueva Tarea
            </ButtonSecondary>
        </Grid>
        <Grid item xs={12}>
            <DividerBase />
        </Grid>
        { tasks.length > 0 ? (
            <Grid item xs={12}>
                
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="droppable">
                    {(provided, snapshot) => (
                        <RootRef rootRef={provided.innerRef}>
                        <List>
                            {tasks.map((item, index) => (
                            <Draggable key={item.timestamp} draggableId={String(item.timestamp)} index={index}>
                                {(provided, snapshot) => (
                                <ListItemTask
                                    handleDeleteClick={handleDeleteClick}
                                    handleEditClick={handleEditClick}
                                    task={item}
                                    ContainerComponent="li"
                                    ContainerProps={{ ref: provided.innerRef }}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    style={getItemStyle(
                                    snapshot.isDragging,
                                    provided.draggableProps.style
                                    )} />
                                )}
                            </Draggable>
                            ))}
                            {provided.placeholder}
                        </List>
                        </RootRef>
                    )}
                    </Droppable>
                </DragDropContext>

            </Grid>
        ) : (
            <>
                <Grid item xs={12}>
                    <SimpleWrapperText>
                        Aún no tienes tareas
                    </SimpleWrapperText>
                </Grid>
                <Grid item xs={12}>
                    <ButtonBase>
                        Agregar 50 tareas
                    </ButtonBase>
                </Grid>
            </>
        ) }
    </Grid>
);

HomePage.propTypes = {
    tasks: PropTypes.array,
    durations: PropTypes.array,
    handleNewTaskButtonClick: PropTypes.func,
    handleEditClick: PropTypes.func,
    handleDeleteClick: PropTypes.func,
    onDragEnd: PropTypes.func,
    handleTimekeeperFinish: PropTypes.func
};

export default HomePage;
