import db from '../../../lib/db';
import utils from '../../../lib/utils';
import validation from '../../../lib/validation/task';

const deleteTask = async id => {
    try {
        const params = {
            TableName: process.env.REACT_APP_DYNAMODB_TABLE_NAME,
            Key: {
                type: `task`,
                timestamp: parseInt(id)
            }
        };
        return await db.delete(params).promise();
    } catch (e) {
        console.error(`Error deleting task`, e);
        utils.constructCustomErrorByType('TASK_DELETE');
    }
};

const updateTask = async (id, dataToUpdate) => {
    try {
        const dataValidated = validation.validateUpdate(dataToUpdate);

        const Key = {
            type: `task`,
            timestamp: parseInt(id)
        };
        const UpdateExpression = `set #description = :description, #duration = :duration`;
        const ExpressionAttributeNames = {
            '#description': 'description',
            '#duration': 'duration'
        };
        const ExpressionAttributeValues = {
            ':description': dataValidated.description,
            ':duration': dataValidated.duration
        };
        const params = {
            TableName: process.env.REACT_APP_DYNAMODB_TABLE_NAME,
            Key,
            UpdateExpression,
            ExpressionAttributeNames,
            ExpressionAttributeValues
        };

        return await db.update(params).promise();
    } catch (e) {
        console.error(`Error updating task`, e);
        utils.constructCustomErrorByType(`TASK_UPDATE`);
    }
};

const handler = async ({
    method,
    body,
    query
}, res) => {
    let statusResponseCode = 403; // forbbiden as default status code
    let response = ``;

    try {
        if (method === 'DELETE') {
            await deleteTask(query.id);

            response = utils.constructSuccessResponse({
                type: `TASK_DELETED`,
                data: query.id
            });
            statusResponseCode = 200;
        } else if (method === 'PUT') {
            const bodyObject = JSON.parse(body);
            const updateResponse  = await updateTask(query.id, bodyObject);
            response = utils.constructSuccessResponse({
                type: `TASK_UPDATED`,
                data: updateResponse
            });
            statusResponseCode = 201;
        }
    } catch (e) {
        response = utils.constructErrorResponse(e);
    }
    console.log(`respuesta`, response);
    res.status(statusResponseCode).json(response);
};

export default handler;
