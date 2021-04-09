import * as yup from 'yup';

import utils from '../utils';

const validationTask = (() => {
    const YUP_OPTIONS_TO_VALIDATE = {
        stripUnknown: true
    };

    const createSchema = yup.object().shape({
        duration: yup.number().required(),
        title: yup.string().max(100).required(),
        description: yup.string().max(255).required(),
        timestamp: yup.number().required(),
        seconds: yup.number()
            .max(59)
            .min(0),
        minutes: yup.number()
            .max(120)
            .min(1)
            .when('seconds', (seconds, schema) => {
                return seconds ?
                    schema.max(119) :
                    schema.max(120)
            }),
        type: yup.string().required(),
        status: yup.string().required()
    }).required();

    const editSchema = yup.object().shape({
        duration: yup.number(),
        description: yup.string().max(255)
    });

    const validateCreate = bodyToValidate => {
        try {
            return createSchema.validateSync(bodyToValidate, YUP_OPTIONS_TO_VALIDATE);
        } catch (e) {
            console.error(`Validation error`, e);
            utils.constructCustomErrorByType(`VALIDATION_ERROR`);
        }
    };

    const validateUpdate = bodyToValidate => {
        try {
            return editSchema.validateSync(bodyToValidate, YUP_OPTIONS_TO_VALIDATE);
        } catch (e) {
            console.error(`Validation error`, e);
            utils.constructCustomErrorByType(`VALIDATION_ERROR`);
        }
    };

    return {
        validateCreate,
        validateUpdate
    };
})();

export default validationTask;
