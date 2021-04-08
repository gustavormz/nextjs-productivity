import {
    withStyles,
    Divider
} from '@material-ui/core';

const styles = {
    root: {
        marginTop: `20px`,
        marginBottom: `15px`
    }
};

const DividerBase = withStyles(styles)(Divider);

export default DividerBase;
