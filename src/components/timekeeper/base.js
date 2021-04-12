import PropTypes from 'prop-types';
import {
    Avatar,
    Box,
    withStyles,
    IconButton,
    Tooltip,
    CircularProgress,

} from '@material-ui/core';
import {
    Pause,
    Stop,
    RotateLeft,
    PlayArrow
} from '@material-ui/icons';

const getTwoDigitsFormat = number =>
    number < 10 ? `0${number}` : number;

// format time to display
const formatTime = seconds => {
    const hours = Math.floor(seconds / 60 / 60);
    const minutes = Math.floor((seconds - (hours * 60 * 60)) / 60);
    const restSeconds = seconds - (hours * 60 * 60) - (minutes * 60);
    return `${getTwoDigitsFormat(hours)}:${getTwoDigitsFormat(minutes)}:${getTwoDigitsFormat(restSeconds)}`;
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
    handleStop,
    totalTime
}) => (
    <BoxContainerStyled>
        <div style={{
            flex: 9,
            display: `flex`,
            justifyContent: `center`
        }}>
            <Box
                position="relative" display="inline-flex">
                <CircularProgress
                    style={{
                        height: 110,
                        width: 110
                    }}
                    size={10}
                    value={Math.round(100 / totalTime * initialTime)}
                    variant={'determinate'} />
                <Box
                    top={0}
                    left={0}
                    bottom={0}
                    right={0}
                    position="absolute"
                    display="flex"
                    alignItems="center"
                    justifyContent="center">
                    <Avatar style={{
                        height: 100,
                        width: 100,
                        backgroundColor: `white`
                    }}>
                        <Avatar style={{
                            height: 95,
                            width: 95,
                            backgroundColor: `#93adb4`
                        }}>
                            { formatTime(initialTime) }
                        </Avatar>
                    </Avatar>
                </Box>
            </Box>
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
