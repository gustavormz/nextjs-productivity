import PropTypes from 'prop-types';
import {
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Avatar,
    IconButton
} from '@material-ui/core';
import {
    Edit,
    Cancel
} from '@material-ui/icons';

import TypographyBase from '../typography/base';

const CardTask = ({
    task,
    handleEditClick,
    handleDeleteClick,
    durations
}) => (
    <Card variant={'outlined'}>
        <CardHeader
            action={
                <>
                    <IconButton onClick={() => handleEditClick(task)}>
                        <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteClick(task)}>
                        <Cancel />
                    </IconButton>
                </>
            }
            avatar={
                <Avatar>
                    {task.title[0]}        
                </Avatar>
            }
            title={task.title}/>
        <CardContent>
            <TypographyBase style={{ textAlign: 'justify' }}>
                {task.description}
            </TypographyBase>
        </CardContent>
        <CardActions>

        </CardActions>
    </Card>
);

CardTask.propTypes = {
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

CardTask.defaultProps = {
    task: {
        duration: 0,
        title: ``,
        description: ``,
        index: 0,
        status: `PENDING`,
        timestamp: 0,
        minutes: 0,
        seconds: 0
    }
};

export default CardTask;

