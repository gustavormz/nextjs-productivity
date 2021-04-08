import PropTypes from 'prop-types';
import {
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Avatar
} from '@material-ui/core';

import TypographyBase from '../typography/base';

const CardTask = ({
    duration,
    title,
    description,
    index,
    status,
    timestamp
}) => (
    <Card variant={'outlined'}>
        <CardHeader
            avatar={
                <Avatar>
                    {title[0]}        
                </Avatar>
            }
            title={title}/>
        <CardContent>
            <TypographyBase style={{ textAlign: 'justify' }}>
                {description}
            </TypographyBase>
        </CardContent>
        <CardActions>

        </CardActions>
    </Card>
);

CardTask.propTypes = {
    duration: PropTypes.number,
    title: PropTypes.string,
    description: PropTypes.string,
    index: PropTypes.number,
    status: PropTypes.string,
    timestamp: PropTypes.number
};

export default CardTask;

