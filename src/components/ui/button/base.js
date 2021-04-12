import {
    Button,
    withStyles
} from '@material-ui/core';

const styles = theme => ({
    root: {
        width: `100%`,
        fontSize: `0.9rem`,
        paddingTop: `6px`,
        paddingBottom: `6px`,
        [theme.breakpoints.down('md')]: {
            fontSize: `0.85rem`
        },
        [theme.breakpoints.down('sm')]: {
            fontSize: `0.75rem`
        }
    },
    disabled: {
        backgroundColor: `#d3d3d3`
    }
});

const ButtonBase = withStyles(styles)(({
    children,
    ...props
}) => (
    <Button
        variant={'contained'}
        color={'primary'}
        { ...props }>
        { children }
    </Button>
));

export default ButtonBase;
