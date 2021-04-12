import {
    AppBar,
    Toolbar,
    withStyles
} from '@material-ui/core';

const styles = {
    root: {
        paddingBottom: `2px`,
        paddingTop: `2px`
    }
};

const AppBarStyled = withStyles(styles)(AppBar);

const AppBarBase = ({
    children
}) => (
    <AppBarStyled
        color={'primary'}
        position={`static`}>
        <Toolbar>
            { children }
        </Toolbar>
    </AppBarStyled>
);

export default AppBarBase;
