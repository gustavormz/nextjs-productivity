import {
    withStyles,
    ListItemIcon
} from '@material-ui/core';

const styles = theme => ({
    root: {
        marginRight: 30,
        [theme.breakpoints.down('md')]: {
            marginRight: 0
        }
    }
});

const ListItemIconTask = withStyles(styles)(ListItemIcon);

export default ListItemIconTask;
