import PropTypes from 'prop-types';
import {
    Grid
} from '@material-ui/core';

import TextFieldBase from '../../ui/textField/base';
import SelectTaskStatus from '../../ui/select/task/status';
import SelectTaskDuration from '../../ui/select/task/duration';
import TypographyBase from '../../typography/base';
import FormDuration from '../../form/duration';
import SelectBase from '../../ui/select/base';

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
    touched,
    isStatusEdit
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
        <Grid item xs={12}>
            <SelectTaskStatus
                disabled={!isEdit || !isStatusEdit}
                onChange={handleChange ? handleChange(`status`) : null}
                value={values.status}/>
        </Grid>
        <Grid item xs={12}>
            <TypographyBase>
                Duración
            </TypographyBase>
        </Grid>
        <Grid item xs={12}>
            <SelectBase
                labelWidth={62}
                inputProps={{
                    name: 'duration'
                }}
                title={`Duración`}
                disabled={!isEdit}
                onChange={handleChange ? handleChange(`duration`) : null}
                value={values.duration}
                options={values.durations}/>
        </Grid>
        { values.duration === `custom` && (
            <Grid item xs={12}>
                <FormDuration
                    values={values}
                    isEdit={isEdit}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    errors={errors}
                    touched={touched}/>
            </Grid>
        ) }
    </Grid>
);

FormTaskBase.propTypes = {
    values: PropTypes.shape({
        title: PropTypes.string,
        description: PropTypes.string,
        index: PropTypes.number,
        status: PropTypes.string,
        timestamp: PropTypes.number,
        duration_title: PropTypes.string,
        durations: PropTypes.array
    }),
    isEdit: PropTypes.bool,
    handleBlur: PropTypes.func,
    handleChange: PropTypes.func,
    errors: PropTypes.object,
    touched: PropTypes.object,
    setFieldValue: PropTypes.func,
    mapStatus: PropTypes.object,
    isStatusEdit: PropTypes.bool
};

FormTaskBase.defaultProps = {
    isEdit: true,
    errors: {},
    touched: {},
    isStatusEdit: true
};

export default FormTaskBase;
