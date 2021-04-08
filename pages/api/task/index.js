import db from '../../../lib/db';
import validation from '../../../lib/validation';
import utils from '../../../lib/utils';

const handler = async ({
    method,
    body
}, res) => {
    let statusResponseCode = 403; // forbbiden as default status code
    let response = undefined;

    try {
        if (method === 'GET') { // get all task
            const params = {
                TableName: process.env.REACT_APP_DYNAMODB_TABLE_NAME
            };

            response = await db.scan(params).promise();
        } else if (method === 'POST') { //create task
            //validate request body
            const requestBodyValidated = validation.validateCreate(body);

            const params = {
                TableName: process.env.REACT_APP_DYNAMODB_TABLE_NAME,
                Item: requestBodyValidated
            };

            await db.put(params).promise();
        }
    } catch (e) {
        console.error(`ERROR IN PETITION`, e);
        response = utils.constructErrorResponse(e);
    }

    res.status(statusResponseCode).json(response);
};

export default handler;
