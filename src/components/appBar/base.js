import {
    AppBar,
    Toolbar,
    withStyles
} from '@material-ui/core';

const styles = {
    root: {
        backgroundColor: 'white',
        paddingBottom: `2px`,
        paddingTop: `2px`
    }
};

const AppBarStyled = withStyles(styles)(AppBar);

const AppBarBase = ({
    children
}) => (
    <AppBarStyled position={`static`}>
        <Toolbar>
            { children }
        </Toolbar>
    </AppBarStyled>
);

export default AppBarBase;
