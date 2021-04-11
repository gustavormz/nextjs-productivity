import {
    withStyles,
    ListItemText
} from '@material-ui/core';

const styles = theme => ({
    primary: {
        fontSize: `1rem`,
        [theme.breakpoints.down('sm')]: {
            fontSize: `0.8rem`
        },
        color: `black`
    }
});

const ListItemTextBase = withStyles(styles)(ListItemText);

export default ListItemTextBase;
