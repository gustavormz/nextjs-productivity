import PropTypes from 'prop-types';
import {
    Avatar,
    ListItem,
    ListItemText,
    IconButton,
    ListItemSecondaryAction,
    ListItemAvatar,
    Hidden,
    Tooltip,
    withStyles
} from '@material-ui/core';
import {
    Done,
    Cancel,
    PlayCircleFilled
} from '@material-ui/icons';

import PaperTaskStatus from '../../paper/task/status';
import ListItemIconTask from '../item/icon/task';
import ButtonTaskStart from '../../ui/button/task/start';

const styles = theme => ({
    secondaryAction: {
        paddingTop: 12,
        paddingBottom: 12,
        paddingLeft: 0,
        paddingRight: 0
    }
});

const ListItemStyled = withStyles(styles)(ListItem);

const ListItemTask = ({
    mapStatus,
    handleFinishTask,
    isActive,
    task,
    handleEditClick,
    handleDeleteClick,
    handleStart,
    durations,
    ...props
}) => (
    <ListItemStyled
        onClick={() => handleEditClick(task)}
        {...props}>
        <ListItemIconTask>
            <Hidden mdUp>
                <Tooltip title={'Estado'}>
                    <Avatar>
                        {mapStatus[task.status][0]}
                    </Avatar>
                </Tooltip>
            </Hidden>
        </ListItemIconTask>
        <Hidden mdDown>
            <ListItemAvatar>
                <Tooltip title={`Tipo de duración`}>
                    <Avatar>
                        M
                    </Avatar>
                </Tooltip>
            </ListItemAvatar>
        </Hidden>
        <ListItemText
            secondary={(
                <Hidden mdDown>
                    {task.description}
                </Hidden>
            )}
            primary={task.title}/>
        <ListItemSecondaryAction>
            { handleStart && (
                <Tooltip
                    title={'Iniciar'}
                    onClick={() => handleStart(task)}>
                    <IconButton
                        style={{ padding: 4 }}>
                        <PlayCircleFilled />
                    </IconButton>
                </Tooltip>
            ) }
            { handleFinishTask && (
                <Tooltip
                    title={'Finalizar'}
                    onClick={() => handleFinishTask(task)}>
                    <IconButton
                        style={{ padding: 4 }}>
                        <Done />
                    </IconButton>
                </Tooltip>
            )}
            { !handleStart && (
                <Tooltip
                    title={`Eliminar`}
                    onClick={() => handleDeleteClick(task)}>
                    <IconButton
                        style={{ padding: 4 }}>
                        <Cancel />
                    </IconButton>
                </Tooltip>
            ) }
        </ListItemSecondaryAction>
    </ListItemStyled>
);

ListItemTask.propTypes = {
    task: PropTypes.shape({
        duration: PropTypes.number,
        title: PropTypes.string,
        description: PropTypes.string,
        index: PropTypes.number,
        status: PropTypes.string,
        timestamp: PropTypes.number,
        minutes: PropTypes.number,
        seconds: PropTypes.seconds
    }),
    handleEditClick: PropTypes.func,
    handleDeleteClick: PropTypes.func,
    durations: PropTypes.array,
    handleFinishTask: PropTypes.func,
    isActive: PropTypes.bool,
    mapStatus: PropTypes.object,
    handleStart: PropTypes.func
};

ListItemTask.defaultProps = {
    mapStatus: {
        'FINISHED': `Terminada`,
        'PENDING': `Pendiente`
    }
};

export default ListItemTask;
