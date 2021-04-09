import PropTypes from 'prop-types';
import {
    Grid
} from '@material-ui/core';

import TextFieldBase from '../ui/textField/base';
import SelectTaskStatus from '../ui/select/task/status';
import SelectTaskDuration from '../ui/select/task/duration';

const isTextFieldError = (errors, name, touched) => 
    errors.hasOwnProperty(name) && touched[name];
const getTextFieldTextError = (errors, name, touched) =>
    isTextFieldError(errors, name, touched) ? errors[name] : ``;

const FormTaskBase = ({
    values,
    isEdit,
    handleChange,
    handleBlur,
    errors,
    touched
}) => (
    <Grid container spacing={2}>
        <Grid item xs={12}>
            <TextFieldBase
                disabled={!isEdit}
                onChange={handleChange ? handleChange(`duration_title`) : null}
                onBlur={handleBlur}
                value={values.duration_title}
                error={isTextFieldError(errors, 'duration_title', touched)}
                helperText={getTextFieldTextError(errors, 'duration_title', touched)}
                name={'duration_title'}
                label={'Título'}/>
        </Grid>
        <Grid item xs={6}>
            <TextFieldBase
                type={'number'}
                disabled={!isEdit}
                onChange={handleChange ? handleChange(`minutes`) : null}
                onBlur={handleBlur}
                value={values.minutes}
                error={isTextFieldError(errors, 'minutes', touched)}
                helperText={getTextFieldTextError(errors, 'minutes', touched)}
                name="minutes"
                label={'Minutos'}/>
        </Grid>
        <Grid item xs={6}>
            <TextFieldBase
                type={'number'}
                disabled={!isEdit}
                onChange={handleChange ? handleChange(`seconds`) : null}
                onBlur={handleBlur}
                value={values.seconds}
                error={isTextFieldError(errors, 'seconds', touched)}
                helperText={getTextFieldTextError(errors, 'seconds', touched)}
                name="seconds"
                label={'Segundos'}/>
        </Grid>
    </Grid>
);

FormTaskBase.propTypes = {
    values: PropTypes.shape({
        duration_title: PropTypes.string
    }),
    isEdit: PropTypes.bool,
    handleBlur: PropTypes.func,
    handleChange: PropTypes.func,
    errors: PropTypes.object,
    touched: PropTypes.object,
    setFieldValue: PropTypes.func,
    mapStatus: PropTypes.object
};

FormTaskBase.defaultProps = {
    isEdit: true,
    errors: {},
    touched: {}
};

export default FormTaskBase;
