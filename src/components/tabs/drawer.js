import {
    Tabs,
    withStyles
} from '@material-ui/core';

const styles = theme => ({
    indicator: {
        backgroundColor: '#c4dfe6'
    }
});

const TabsDrawer = withStyles(styles)(Tabs);

export default TabsDrawer;
