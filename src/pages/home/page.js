import PropTypes from 'prop-types';
import {
    Grid,
    Hidden
} from '@material-ui/core';

import TypographyTitle from '../../components/typography/title';
import ButtonSecondary from '../../components/ui/button/secondary';
import DividerBase from '../../components/divider/base';
import CardTask from '../../components/card/task';
import SimpleWrapperText from '../../components/paper/simpleWrapperText';
import ButtonBase from '../../components/ui/button/base';

const HomePage = ({
    tasks,
    handleNewTaskButtonClick,
    durations,
    handleEditClick,
    handleDeleteClick
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
                { tasks.map(task => (
                    <CardTask
                        handleDeleteClick={handleDeleteClick}
                        handleEditClick={handleEditClick}
                        durations={durations}
                        key={task.timestamp}
                        task={task}/>
                )) }
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
    handleDeleteClick: PropTypes.func
};

export default HomePage;
