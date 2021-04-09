import PropTypes from 'prop-types';
import {
    Grid,
    Hidden,
    RootRef,
    List
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

const getItems = count =>
  Array.from({ length: count }, (v, k) => k).map(k => ({
    id: `item-${k}`,
    primary: `item ${k}`,
    secondary: k % 2 === 0 ? `Whatever for ${k}` : undefined
  }));

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const getItemStyle = (isDragging, draggableStyle) => ({
  // styles we need to apply on draggables
  ...draggableStyle,

  ...(isDragging && {
    background: "rgb(235,235,235)"
  })
});

const getListStyle = isDraggingOver => ({
  //background: isDraggingOver ? 'lightblue' : 'lightgrey',
});

const HomePage = ({
    tasks,
    handleNewTaskButtonClick,
    durations,
    handleEditClick,
    handleDeleteClick,
    onDragEnd
}) => (
    <Grid container spacing={4}>
        <Grid item xs={12}/>
        <Grid item xs={12}>
            <TypographyTitle>
                Home
            </TypographyTitle>
        </Grid>
        <Hidden smDown>
            <Grid item md={7}/>
        </Hidden>
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
                        <List style={getListStyle(snapshot.isDraggingOver)}>
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
    onDragEnd: PropTypes.func
};

export default HomePage;
