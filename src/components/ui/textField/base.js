import {
    TextField,
    withStyles
} from '@material-ui/core';

const styles = theme => ({
    root: {
        width: `100%`,
        '& label.MuiFormLabel-root': {
            [theme.breakpoints.down('sm')]: {
                fontSize: `0.8rem`
            },
            [theme.breakpoints.up('sm')]: {
                fontSize: `1rem`
            }
        }
    }
});

const TextFieldBase = withStyles(styles)((props) => (
    <TextField
        color={'primary'}
        { ...props }
        size={`small`}
        variant={`outlined`} />
));

export default TextFieldBase;
