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
    Edit,
    Cancel
} from '@material-ui/icons';

import PaperTaskStatus from '../../paper/task/status';
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

const ListItemTask = ({
    task,
    handleEditClick,
    handleDeleteClick,
    durations,
    ...props
}) => (
    <ListItemStyled {...props}>
        <ListItemIconTask>
            <Hidden mdDown>
                <PaperTaskStatus>
                    <p style={{ margin: 0 }}>
                        Terminada
                    </p>
                </PaperTaskStatus>
            </Hidden>
            <Hidden mdUp>
                <Tooltip title={'Estado'}>
                    <Avatar>
                        T
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
            <IconButton
                onClick={() => handleEditClick(task)}
                style={{ padding: 4 }}>
                <Edit />
            </IconButton>
            <IconButton
                onClick={() => handleDeleteClick(task)}
                style={{ padding: 4 }}>
                <Cancel />
            </IconButton>
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
    durations: PropTypes.array
};

export default ListItemTask;
