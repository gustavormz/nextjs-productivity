import {
    Button,
    withStyles
} from '@material-ui/core';

const styles = theme => ({
    root: {
        backgroundColor: `red`,
        width: `100%`,
        fontSize: `0.9rem`,
        paddingTop: `6px`,
        paddingBottom: `6px`,
        marginRight: 12,
        [theme.breakpoints.down('md')]: {
            fontSize: `0.85rem`
        },
        [theme.breakpoints.down('sm')]: {
            fontSize: `0.75rem`,
            marginRight: 6
        }
    },
    disabled: {
        backgroundColor: `#d3d3d3`
    }
});

const ButtonBase = withStyles(styles)(Button);

export default ButtonBase;
