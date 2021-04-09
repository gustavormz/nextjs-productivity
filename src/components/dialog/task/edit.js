import PropTypes from 'prop-types';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Grid
} from '@material-ui/core';
import {
    Formik
} from 'formik';
import * as Yup from 'yup';

import FormTask from '../../form/task/base';
import ButtonBase from '../../ui/button/base';
import ButtonSecondary from '../../ui/button/secondary';
import DividerBase from '../../divider/base';

const DialogTaskEdit = ({
    open,
    handleClose,
    handleFormSubmit,
    initialValues,
    validationSchema,
    finalValues,
    durations
}) => (
    <Dialog
        open={open}
        onClose={handleClose}>
        <DialogTitle onClose={handleClose}>
            Nueva Tarea
        </DialogTitle>
        <DialogContent>
            <Formik
                initialValues={{
                    ...finalValues,
                    durations
                } || {
                    ...initialValues,
                    durations
                }}
                validationSchema={validationSchema}
                onSubmit={handleFormSubmit}>
                {({
                    values,
                    touched,
                    errors,
                    handleSubmit,
                    handleChange,
                    handleBlur,
                    isValid,
                }) => (
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <FormTask
                                    isStatusEdit={false}
                                    errors={errors}
                                    handleBlur={handleBlur}
                                    handleChange={handleChange}
                                    touched={touched}
                                    values={values}/>
                            </Grid>
                            <Grid item xs={12}>
                                <DividerBase />
                            </Grid>
                            <Grid item xs={4}/>
                            <Grid item xs={4}>
                                <ButtonBase
                                    disabled={!isValid}
                                    type={'submit'}>
                                    Actualizar
                                </ButtonBase>
                            </Grid>
                            <Grid item xs={4}>
                                <ButtonSecondary
                                    onClick={handleClose}>
                                    Cancelar
                                </ButtonSecondary>
                            </Grid>
                        </Grid>
                    </form>
                )}
            </Formik>
        </DialogContent>
    </Dialog>
);

DialogTaskEdit.propTypes = {
    open: PropTypes.bool,
    handleClose: PropTypes.func,
    handleFormSubmit: PropTypes.func,
    initialValues: PropTypes.object,
    finalValues: PropTypes.object,
    durations: PropTypes.array
};

DialogTaskEdit.defaultProps = {
    validationSchema: Yup.object({
        title: Yup.string()
            .max(100, `Debe contener máximo 100 caracteres`)
            .required(`El título es requerido`),
        description: Yup.string()
            .max(255, `Debe contener máximo 255 caracteres`)
            .required(`La descripción es requerida`),
        seconds: Yup.number()
            .max(59, `El tiempo máxmimo en segundos es 59`)
            .min(0, `El tiempo mínimo es segundos es de 0`).nullable(),
        minutes: Yup.number()
            .max(120, `El tiempo máximo en minutos es de 120`)
            .min(1, `El tiempo mínimo en minutos es de 1`)
            .when('durations', (durations, schema) => {
                return schema.test(
                    ``,
                    `Elige un valor distinto a los ya existentes`,
                    value => {
                        for (let duration of durations) {
                            if (value === duration.minutes) {
                                return false;
                            }
                        }
                        return true;
                    }
                );
            }).when('seconds', (seconds, schema) => {
                return seconds ?
                    schema.max(119, `El tiempo máximo en minutos es de 119`) :
                    schema.max(120, `El tiempo máximo en minutos es de 120`)
            }).nullable(),
        duration_title: Yup.string()
            .max(100, `Debe contener máximo 100 caracteres`)
            .when('duration', {
                is: true,
                then: Yup.string().required(`El título es requerido`)
            })
    }),
    initialValues: {
        title: ``,
        description: ``,
        minutes: 0,
        seconds: 0,
        status: `PENDING`,
        durations: [],
        duration: ``,
        duration_title: ``,
        minutes: 1,
        seconds: 0
    }
};

export default DialogTaskEdit;
