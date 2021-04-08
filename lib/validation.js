import * as yup from 'yup';

import utils from './utils';

const validation = (() => {
    const YUP_OPTIONS_TO_VALIDATE = {
        stripUnknown: true
    };

    const createSchema = yup.object().shape({
        duration: yup.number().required(),
        title: yup.string().max(100).required(),
        description: yup.string().max(255).required(),
        index: yup.number(),
        timestamp: yup.number().required()
    }).required();

    const validateCreate = bodyToValidate => {
        try {
            return createSchema.validateSync(bodyToValidate, YUP_OPTIONS_TO_VALIDATE);
        } catch (e) {
            console.error(`Validation error`, e);
            utils.constructCustomErrorByType(`VALIDATION_ERROR`);
        }
    };

    return {
        validateCreate
    };
})();

export default validation;
