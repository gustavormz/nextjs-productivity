import {
    withStyles,
    createMuiTheme
} from '@material-ui/core';
import lightBlue from "@material-ui/core/colors/lightBlue";
import PropTypes from 'prop-types';
import {
    KeyboardDatePicker,
    MuiPickersUtilsProvider
} from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import {
    ThemeProvider
} from '@material-ui/styles';
import "moment/locale/es";

const pickerStyles = theme => ({
    root: {
        width: `100%`,
        '& label.MuiFormLabel-root': {
            [theme.breakpoints.down('sm')]: {
                fontSize: `1rem`
            },
            [theme.breakpoints.up('sm')]: {
                fontSize: `1rem`
            }
        },
        '& .MuiInputBase-root': {
            [theme.breakpoints.down('sm')]: {
                fontSize: `0.8rem`
            },
            [theme.breakpoints.up('sm')]: {
                fontSize: `1rem`
            },
            '&.Mui-focused fieldset': {
              borderColor: '#37C8EC'
            },
            '&:hover fieldset': {
                borderColor: '#5BD6F7'
            }
        }
    }
});

const pickerTheme = createMuiTheme({
    overrides: {
        MuiPickersToolbar: {
            toolbar: {
              backgroundColor: '#07575b',
            },
        },
        MuiPickersDay: {
            daySelected: {
              backgroundColor: '#428488',
            },
            dayDisabled: {
              color: lightBlue["100"],
            },
            current: {
              color: lightBlue["900"],
            }
        }
    }
});

const DatePickerStyled = withStyles(pickerStyles)(KeyboardDatePicker);

const DatePickerBase = ({
    value,
    placeholder,
    onChange,
    minDate,
    format,
    label,
    size,
    variant,
    inputVariant,
    ...props
}) => (
    <MuiPickersUtilsProvider
        utils={MomentUtils}>
        <ThemeProvider theme={pickerTheme}>
            <DatePickerStyled
                { ...props }
                label={label}
                minDate={minDate}
                value={value}
                placeholder={placeholder}
                onChange={onChange}
                format={format}
                size={size}
                autoOk
                variant={variant}
                inputVariant={inputVariant}/>
        </ThemeProvider>
    </MuiPickersUtilsProvider>
);

DatePickerBase.propTypes = {
    placeholder: PropTypes.string,
    label: PropTypes.string,
    onChange: PropTypes.func,
    format: PropTypes.string,
    size: PropTypes.string,
    variant: PropTypes.string,
    inputVariant: PropTypes.string
};

DatePickerBase.defaultProps = {
    format: 'DD/MM/YYYY',
    size: `small`,
    variant: `inline`,
    inputVariant: `outlined`
};

export default DatePickerBase;
