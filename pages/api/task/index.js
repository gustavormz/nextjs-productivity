import initialTasks from './tasks.json';
import db from '../../../lib/db';
import validation from '../../../lib/validation';
import utils from '../../../lib/utils';

const handler = async ({
    method,
    body
}, res) => {
    let statusResponseCode = 403; // forbbiden as default status code
    let response = ``;

    try {
        if (method === 'GET') { // get all task
            const params = {
                TableName: process.env.REACT_APP_DYNAMODB_TABLE_NAME
            };

            const dynamoResponse = await db.scan(params).promise();
            response = utils.constructSuccessResponse({
                type: `RESOURCE_FOUND`,
                data: dynamoResponse
            });
            statusResponseCode = 200;
        } else if (method === 'POST') { //create task
            //validate request body
            const requestBodyValidated = validation.validateCreate(body);

            const params = {
                TableName: process.env.REACT_APP_DYNAMODB_TABLE_NAME,
                Item: requestBodyValidated
            };

            await db.put(params).promise();
            response = utils.constructCustomErrorByType({
                type: `RESOURCE_CREATED`
            });
            statusResponseCode = 201;
        }
    } catch (e) {
        response = utils.constructErrorResponse(e);
    }
    res.status(statusResponseCode).json(response);
};

export default handler;
