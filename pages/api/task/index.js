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

const getTasksByParams = async _params => {
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
    body,
    query
}, res) => {
    let statusResponseCode = 403; // forbbiden as default status code
    let response = ``;

    try {
        if (method === 'GET') {
            if (query.hasOwnProperty('status')) {
                const KeyConditionExpression = "#type = :type";
                const FilterExpression = `#status = :status`;
                const ExpressionAttributeNames = {
                    "#type": "type",
                    '#status': "status"
                };
                const ExpressionAttributeValues = {
                    ":type": "task",
                    ':status': query.status
                };

                const tasksByStatusResponse = await getTasksByParams({
                    KeyConditionExpression,
                    ExpressionAttributeNames,
                    ExpressionAttributeValues,
                    FilterExpression
                });

                const tasksByStatus = tasksByStatusResponse.Items ||
                    [];

                response = utils.constructSuccessResponse({
                    type: `TASKS_FOUND`,
                    data: tasksByStatus
                });
                statusResponseCode = 200;   
            }
        } else if (method === 'POST') { // create task
            const bodyObject = JSON.parse(body);
            const newTask = await createTask(bodyObject);

            // get lastest tasks to set the new task
            const Key = {
                type: `list`,
                timestamp: 1
            };
            const {
                Item
            } = await getByKey(Key);

            Item.list.push(newTask);

            // update the list
            await updateTaskOrderList(Item.list);

            response = utils.constructSuccessResponse({
                type: `TASK_CREATED`,
                data: {
                    itemAdded: newTask,
                    lists: {
                        ...getOrderedTask(Item.list),
                        pendingOrdered: Item.list
                    }
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
