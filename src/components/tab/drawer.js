import {
    Tab,
    withStyles
} from '@material-ui/core';

const styles = theme => ({
    root: {
        opacity: 0.2,
        '&$selected': {
            color: `white`,
            background: `#428488`
        }
    }
});

const TabBase = withStyles(styles)(Tab);

export default TabBase;
