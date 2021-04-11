import PropTypes from 'prop-types';
import {
    Avatar,
    Box,
    withStyles,
    IconButton,
    Tooltip
} from '@material-ui/core';
import {
    Pause,
    Stop,
    RotateLeft,
    PlayArrow
} from '@material-ui/icons';

const formatTime = seconds => {
    return seconds;
};

const boxContainerStyles = theme => ({
    root: {
        padding: 15,
        display: `flex`,
        flexDirection: `column`,
        [theme.breakpoints.down('md')]: {
            padding: 8
        }
    }
});

const BoxContainerStyled = withStyles(boxContainerStyles)(Box);

const TimekeeperBase = ({
    initialTime,
    handlePause,
    handleReset,
    handleResume,
    handleStop
}) => (
    <BoxContainerStyled>
        <div style={{
            flex: 9,
            display: `flex`,
            justifyContent: `center`
        }}>
            <Avatar style={{
                height: 75,
                width: 75
            }}>
                <Avatar style={{
                    height: 65,
                    width: 65
                }}>
                    { formatTime(initialTime) }
                </Avatar>
            </Avatar>
        </div>
        <div style={{
            flex: 3,
            display: `flex`,
            alignItems: `space-between`
        }}>
            <Tooltip
                onClick={handleResume}
                title={'Reanudar'}>
                <IconButton>
                    <PlayArrow />
                </IconButton>
            </Tooltip>
            <Tooltip
                onClick={handlePause}
                title={'Pausar'}>
                <IconButton>
                    <Pause />  
                </IconButton>
            </Tooltip>
            <Tooltip
                onClick={handleStop}
                title={'Parar'}>
                <IconButton>
                    <Stop />
                </IconButton>
            </Tooltip>
            <Tooltip
                onClick={handleReset}
                title={'Reiniciar'}>
                <IconButton>
                    <RotateLeft />
                </IconButton>
            </Tooltip>
        </div>
    </BoxContainerStyled>
);

TimekeeperBase.propTypes = {
    initialTime: PropTypes.number,
    handlePause: PropTypes.func,
    handleReset: PropTypes.func,
    handleResume: PropTypes.func,
    handleStop: PropTypes.func
};

export default TimekeeperBase;
