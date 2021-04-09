const utils = (() => {
    const SUCCESS_TYPE_MAP = {
        default: {
            code: 200,
            message: `Operation executed correctly`
        },
        TASK_FOUND: {
            code: 200,
            message: `Task found`
        },
        TASK_CREATED: {
            code: 201,
            message: `Task created`
        },
        TASK_UPDATED: {
            code: 200,
            message: `Task updated`
        },
        TASK_DELETED: {
            code: 201,
            message: `Task deleted`
        },
        TASKS_FOUND: {
            code: 200,
            message: `Tasks found`
        }
    };

    const ERROR_TYPE_MAP = {
        default: {
            errorCode: 500,
            message: `Internal Server Error`,
        },
        VALIDATION_ERROR: {
            errorCode: 400,
            message: `Validation error`
        },
        INTERNAL_SERVER_ERROR: {
            errorCode: 500,
            message: `Internal server error`
        },
        DURATION_CREATE: {
            errorCode: 500,
            message: `Error creating duration`
        },
        TASK_CREATE: {
            errorCode: 500,
            message: `Error creating task`
        }
    };

    const getSuccessObjectByType = successType => SUCCESS_TYPE_MAP[successType] || SUCCESS_TYPE_MAP.default;

    const getErrorObjectByType = errorType => ERROR_TYPE_MAP[errorType] || ERROR_TYPE_MAP.default;

    const constructCustomErrorByType = (type, message = null) => {
        const error = new Error(message);
        error.message = message;
        error.type = type;
        throw error;
    };

    const constructSuccessResponse = ({
        type: successType,
        data
    }) => {
        const {
            code: statusCode,
            message
        } = getSuccessObjectByType(successType);
    
        return {
            statusCode,
            data,
            message,
            error: false,
            successType: successType || ``
        };
    };

    const constructErrorResponse = ({
        type: errorType,
        message: errorMessage
    }) => {
        const {
            code: statusCode,
            message
        } = getErrorObjectByType(errorType);
    
        return {
            statusCode,
            errorType: errorType || `INTERNAL_SERVER_ERROR`,
            message: errorMessage || message,
            error: true
        };
    };

    return {
        constructCustomErrorByType,
        constructSuccessResponse,
        constructErrorResponse
    };
})();

export default utils;
