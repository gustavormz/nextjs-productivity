import {
    withStyles,
    Paper
} from '@material-ui/core';

const styles = theme => ({
    root: {
        display: `flex`,
        alignItems: `center`,
        justifyContent: `center`,
        width: `130px`,
        paddingTop: `15px`,
        paddingBottom: `15px`,
        paddingLeft: `8px`,
        paddingRight: `8px`,
        marginTop: `15px`,
        marginBottom: `15px`,
        [theme.breakpoints.down('md')]: {
            paddingTop: `10px`,
            paddingBottom: `10px`,
            width: `110px`
        } 
    }
})

const PaperTaskStatus = withStyles(styles)(Paper);

export default PaperTaskStatus;