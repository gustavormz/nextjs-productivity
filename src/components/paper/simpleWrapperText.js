import {
    withStyles,
    Paper
} from '@material-ui/core';

const paperStyles = theme => ({
    root: {
        display: `flex`,
        alignItems: `center`,
        justifyContent: `center`,
        width: `100%`,
        paddingTop: `15px`,
        paddingBottom: `15px`,
        marginTop: `15px`,
        marginBottom: `15px`,
        [theme.breakpoints.down('md')]: {
            paddingTop: `10px`,
            paddingBottom: `10px`,
        } 
    }
})

const PaperSimpleTextWrapper = withStyles(paperStyles)(Paper);

export default PaperSimpleTextWrapper;