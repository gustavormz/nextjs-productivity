import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    withStyles
} from '@material-ui/core';

const selectStyles = theme => ({
    root: {
        [theme.breakpoints.down('sm')]: {
            fontSize: `0.8rem`
        },
        [theme.breakpoints.up('sm')]: {
            fontSize: `1rem`
        }
    }
});

const SelectStyled = withStyles(selectStyles)(Select);

const formControlStyles = {
    root: {
        width: `100%`
    }
};

const FormControlStyled = withStyles(formControlStyles)(FormControl);

const SelectBase = props => (
    <FormControlStyled size={`small`} variant="outlined">
        <InputLabel>
            { props.title }
        </InputLabel>
        <SelectStyled
            { ...props }>
            { props.options.map(({ label, value }) => (
                <MenuItem
                    value={value}
                    key={value}>
                    { label }
                </MenuItem>
            )) }
        </SelectStyled>
    </FormControlStyled>
);

export default SelectBase;
