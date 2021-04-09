import PropTypes from 'prop-types';
import {
    useEffect,
    useState,
    useRef
} from 'react';
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
    handleFinishCount
}) => {
    const [isActive, setIsActive] = useState(true);
    const [seconds, setSeconds] = useState(initialTime);
    const intervalReference = useRef(null);

    if (seconds === 0) {
        handleFinishCount(seconds);
    }

    useEffect(function () {
        intervalReference.current = setInterval(function () {
            setSeconds(seconds => seconds - 1);
        }, 1000);
    }, []);

    function handleResume () {
        if (intervalReference.current) {
            return;
        }
        setIsActive(true);
        intervalReference.current = setInterval(function () {
            setSeconds(seconds => seconds - 1);
        }, 1000);
    }

    function handlePause () {
        if (!intervalReference.current) {
            return;
        }
        clearInterval(intervalReference.current);
        setIsActive(false);
        intervalReference.current = null;
    }

    function handleReset () {
        clearInterval(intervalReference.current);
        setIsActive(false);
        setSeconds(initialTime);
        intervalReference.current = null;
    }

    return (
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
                        { formatTime(seconds) }
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
                <Tooltip title={'Parar'}>
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
};

TimekeeperBase.propTypes = {
    initialTime: PropTypes.number,
    handleFinishCount: PropTypes.func
};

export default TimekeeperBase;
