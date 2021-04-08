import PropTypes from 'prop-types';
import {
    Grid
} from '@material-ui/core';

import TextFieldBase from '../../ui/textField/base';

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
                onChange={handleChange ? handleChange(`title`) : null}
                onBlur={handleBlur}
                value={values.title}
                error={isTextFieldError(errors, 'title', touched)}
                helperText={getTextFieldTextError(errors, 'title', touched)}
                name="title"
                label={'Título'}/>
        </Grid>
        <Grid item xs={12}>
            <TextFieldBase
                disabled={!isEdit}
                onChange={handleChange ? handleChange(`description`) : null}
                onBlur={handleBlur}
                value={values.description}
                error={isTextFieldError(errors, 'description', touched)}
                helperText={getTextFieldTextError(errors, 'description', touched)}
                name="description"
                label={'Descripción'}
                multiline={true}
                rows={2}/>
        </Grid>
    </Grid>
);

FormTaskBase.propTypes = {
    values: PropTypes.shape({
        duration: PropTypes.number,
        title: PropTypes.string,
        description: PropTypes.string,
        index: PropTypes.number,
        status: PropTypes.string,
        timestamp: PropTypes.number
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
    touched: {},
    mapStatus: {
        'PENDING': `Pendiente`,
        'FINISHED': `Terminada` 
    }
};

export default FormTaskBase;
