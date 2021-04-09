import db from '../../lib/db';
import utils from '../../lib/utils';

const updateTaskOrderList = async orderedList => {
    try {
        const Key = {
            type: `list`,
            timestamp: 1
        };
        const UpdateExpression = `set #list = :list`;
        const ExpressionAttributeNames = {
            '#list': 'list'
        };
        const ExpressionAttributeValues = {
            ':list': orderedList
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
        console.error(`Error updating task list`, e);
        utils.constructCustomErrorByType('LIST_UPDATE');
    }
};

const handler = async ({
    method,
    body
}, res) => {
    let statusResponseCode = 403; // forbbiden as default status code
    let response = ``;

    try {
        if (method === 'PUT') {
            //validate request body
            const bodyObject = JSON.parse(body);
            await updateTaskOrderList(bodyObject);

            response = utils.constructSuccessResponse({
                type: `LIST_UPDATED`,
                data: bodyObject
            });
            statusResponseCode = 201;
        }
    } catch (e) {
        response = utils.constructErrorResponse(e);
    }
    res.status(statusResponseCode).json(response);
};

export default handler;
