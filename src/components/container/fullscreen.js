import {
    Container,
    withStyles
} from '@material-ui/core';

const styles = theme => ({
    root: {
        display: `flex`,
        alignItems: `center`,
        justifyContent: `center`,
        minHeight: `100vh`
    }
});

const ContainerFullscreen = withStyles(styles)(Container);

export default ContainerFullscreen;
