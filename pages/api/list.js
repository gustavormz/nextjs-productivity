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

const getByKey = async Key => {
    try {
        const params = {
            TableName: process.env.REACT_APP_DYNAMODB_TABLE_NAME,
            Key
        };

        return await db.get(params).promise();
    } catch (e) {
        console.error(`Error getting tasks by params`, e);
        utils.constructCustomErrorByType('GETTING_LIST');
    }
};

const getOrderedTask = tasks => tasks.reduce((tasksObject, task) => {
    const taskDurationSeconds = task.minutes * 60 + (task.seconds ? task.seconds : 0);

    if (taskDurationSeconds <= 60 * 30) { //short
        tasksObject.pendingShort.push(task);
    } else if (taskDurationSeconds <= 60 * 60) { // medium
        tasksObject.pendingMedium.push(task);
    } else { // long
        tasksObject.pendingLong.push(task);
    }

    return tasksObject;
}, {
    pendingLong: [],
    pendingMedium: [],
    pendingShort: []
});

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
        } else if (method === 'GET') {
            const Key = {
                type: `list`,
                timestamp: 1
            };
            let dynamoResponse = await getByKey(Key);

            // TODO: create 50 random tasks
            if (!dynamoResponse.Item || dynamoResponse.Item.list.length === 0) {
                dynamoResponse = [];
            } else {
                dynamoResponse = dynamoResponse.Item.list;
            }

            response = utils.constructSuccessResponse({
                type: `LIST_FOUND`,
                data: {
                    ...getOrderedTask(dynamoResponse),
                    pendingOrdered: dynamoResponse
                }
            });
            statusResponseCode = 201;
        }
    } catch (e) {
        response = utils.constructErrorResponse(e);
    }
    res.status(statusResponseCode).json(response);
};

export default handler;
