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
    PlayCircleFilled,
    Delete
} from '@material-ui/icons';

import ListItemIconTask from '../item/icon/task';

const styles = theme => ({
    secondaryAction: {
        paddingTop: 12,
        paddingBottom: 12,
        paddingLeft: 0,
        paddingRight: 0
    }
});

const ListItemStyled = withStyles(styles)(ListItem);

const ListItemTextStyled = withStyles(theme => ({
    primary: {
        overflow: 'hidden',
        width: `90%`,
        [theme.breakpoints.down('sm')]: {
            width: `75%`
        }
    },
    secondary: {
        overflow: 'hidden',
        width: `90%`,
        [theme.breakpoints.down('sm')]: {
            width: `75%`
        }
    }
}))(ListItemText);

const ListItemTask = ({
    mapStatus,
    handleFinishTask,
    isActive,
    task,
    handleEditClick,
    handleDeleteClick,
    handleStart,
    durations,
    handleCancel,
    ...props
}) => (
    <ListItemStyled
        divider={true}
        color={'primary'}
        onClick={handleEditClick ?
            () => handleEditClick(task) :
            null
        }
        {...props}>
        <Hidden mdUp>
            <ListItemIconTask>
                <Tooltip title={'Estado'}>
                    <Avatar
                        style={{
                            backgroundColor: `#428488`
                        }}>
                        {task.title[0]}
                    </Avatar>
                </Tooltip>
            </ListItemIconTask>
        </Hidden>
        <Hidden mdDown>
            <ListItemAvatar>
                <Tooltip title={`Tipo de duración`}>
                    <Avatar style={{
                            backgroundColor: `#428488`
                        }}>
                        {task.title[0]}
                    </Avatar>
                </Tooltip>
            </ListItemAvatar>
        </Hidden>
        <ListItemTextStyled
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
            { handleCancel && (
                <Tooltip
                    title={'Cancelar'}
                    onClick={() => handleCancel(task)}>
                    <IconButton
                        style={{ padding: 4 }}>
                        <Cancel />
                    </IconButton>
                </Tooltip>
            ) }
            { handleDeleteClick && (
                <Tooltip
                    title={`Eliminar`}
                    onClick={() => handleDeleteClick(task)}>
                    <IconButton
                        style={{ padding: 4 }}>
                        <Delete />
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
    handleStart: PropTypes.func,
    handleCancel: PropTypes.func
};

ListItemTask.defaultProps = {
    mapStatus: {
        'FINISHED': `Terminada`,
        'PENDING': `Pendiente`
    }
};

export default ListItemTask;
