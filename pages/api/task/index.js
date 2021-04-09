import db from '../../../lib/db';
import validation from '../../../lib/validation/task';
import utils from '../../../lib/utils';

const formatTaskCreateData = data => {
    const timestamp = data.timestamp || Date.now();
    return {
        ...data,
        timestamp,
        type: `task`,
        status: `PENDING`
    };
};

const createTask = async task => {
    try {
        const requestBodyValidated = validation.validateCreate(formatTaskCreateData(task));

        const params = {
            TableName: process.env.REACT_APP_DYNAMODB_TABLE_NAME,
            Item: requestBodyValidated
        };

        await db.put(params).promise();
        return requestBodyValidated;
    } catch (e) {
        console.error(`Error creating task`, e);
        utils.constructCustomErrorByType('TASK_CREATE');
    }
};

const getTaskByParams = async _params => {
    try {
        const params = {
            TableName: process.env.REACT_APP_DYNAMODB_TABLE_NAME,
            ..._params
        };

        return await db.query(params).promise();
    } catch (e) {
        console.error(`Error getting tasks by params`, e);
        utils.constructCustomErrorByType('GETTING_TASK');
    }
};

const getByKey = async Key => {
    try {
        const params = {
            TableName: process.env.REACT_APP_DYNAMODB_TABLE_NAME,
            Key
        };

        return await db.get(params).promise();
    } catch (e) {
        console.error(`Error getting tasks by params`, e);
        utils.constructCustomErrorByType('GETTING_TASK');
    }
};

const getOrderedList = (orderedList, tasksArray) => {
    const orderedListToObject = orderedList.reduce((tasksObject, task) => {
        tasksObject[task.timestamp] = {
            ...task
        };
        return tasksObject;
    }, {});
};

const handler = async ({
    method,
    body,
    query
}, res) => {
    let statusResponseCode = 403; // forbbiden as default status code
    let response = ``;

    try {
        if (method === 'GET') { // get all task
            /*const KeyConditionExpression = "#type = :type";
            const ExpressionAttributeNames = {
                "#type": "type"
            };
            const ExpressionAttributeValues = {
                ":type": "task"
            };*/

            const Key = {
                type: `list`,
                timestamp: 1
            };
            let dynamoResponse = await getByKey(Key);

            console.log(dynamoResponse);

            //  TODO: add random task if doesnt exist durations on database
            if (!dynamoResponse.Item || dynamoResponse.Item.list.length === 0) {
                dynamoResponse = [];       
            }

            response = utils.constructSuccessResponse({
                type: `TASKS_FOUND`,
                data: dynamoResponse.Item.list || dynamoResponse
            });
            statusResponseCode = 200;
        } else if (method === 'POST') { // create task
            const bodyObject = JSON.parse(body);
            const newTask = await createTask(bodyObject);

            response = utils.constructSuccessResponse({
                type: `TASK_CREATED`,
                data: newTask
            });
            statusResponseCode = 201;
        }
    } catch (e) {
        response = utils.constructErrorResponse(e);
    }
    res.status(statusResponseCode).json(response);
};

export default handler;
