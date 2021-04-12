import {
    withStyles,
    Button
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

    },
    outlined: {

    }
});

const ButtonSecondary = withStyles(styles)(({
    children,
    ...props
}) => (
    <Button
        color={'primary'}
        variant={`outlined`}
        { ...props }>
        { children }
    </Button>
));

export default ButtonSecondary;
