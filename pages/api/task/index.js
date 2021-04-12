import _ from 'lodash';

import db from '../../../lib/db';
import validation from '../../../lib/validation/task';
import validationDuration from '../../../lib/validation/duration';
import utils from '../../../lib/utils';
import initialDurations from '../duration/durations.json';

const formatTaskCreateData = data => {
    const timestamp = data.timestamp || Date.now();
    return {
        ...data,
        timestamp,
        type: `task`,
        status: `PENDING`
    };
};

const formatDurationCreateData = data => {
    const timestamp = data.timestamp || Date.now();
    return {
        ...data,
        timestamp,
        type: `duration`,
        value: timestamp
    };
};

const createTask = async (task, isValidate = true) => {
    try {
        const requestBodyValidated =
            isValidate ?
                validation.validateCreate(formatTaskCreateData(task)) :
                task;

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

const createDuration = async duration => {
    try {
        const requestBodyValidated = validationDuration.validateCreate(formatDurationCreateData(duration));
        const params = {
            TableName: process.env.REACT_APP_DYNAMODB_TABLE_NAME,
            Item: requestBodyValidated
        };

        await db.put(params).promise();
        return requestBodyValidated;
    } catch (e) {
        console.error(`Error creating duration`, e);
        utils.constructCustomErrorByType('DURATION_CREATE')
    }
};

const getDurations = async () => {
    try {
        const KeyConditionExpression = "#type = :type";
        const ExpressionAttributeNames = {
            "#type": "type"
        };
        const ExpressionAttributeValues = {
            ":type": "duration"
        };

        let dynamoResponse = await getTasksByParams({
            KeyConditionExpression,
            ExpressionAttributeNames,
            ExpressionAttributeValues
        });

        // add default durations if doesnt exist durations on database
        if (!dynamoResponse.Items || dynamoResponse.Items.length === 0) {
            await Promise.all(initialDurations.map(async duration => {
                await createDuration(duration);
            }));
            dynamoResponse = initialDurations;
        }
        return dynamoResponse.Items || dynamoResponse;
    } catch (e) {
        console.error(`error getting durations`, e);
        return [];
    }
};

const subtractDaysFromDate = (dateMilliseconds, daysToSubtract) => {
    let date = new Date(dateMilliseconds);
    return date.setDate(date.getDate() - daysToSubtract);
};

const getSecondsFromMinutesSeconds = ({
    minutes,
    seconds
}) =>
    minutes * 60 + (seconds || 0);

const getRandomValueBetweenRange = (max, min) =>
    Math.floor(Math.random() * (max - min + 1)) + min;;

const getRandomDurationForTask = (
    durations,
    startMilliseconds,
    endMilliseconds
) => {
    console.log(`duraciones verlas`, durations);
    const randomTimestamp = getRandomValueBetweenRange(startMilliseconds, endMilliseconds);
    const randomDurationIndex = Math.floor(Math.random() * durations.length);
    console.log(`index random`, randomDurationIndex);
    const duration = durations[randomDurationIndex];
    const durationSeconds = getSecondsFromMinutesSeconds(duration);
    const randomSpentTime = getRandomValueBetweenRange(durationSeconds * 80, durationSeconds);;

    return {
        duration: duration.timestamp, // random duration
        timestamp: randomTimestamp, // random timestamp using range
        seconds: duration.seconds,
        minutes: duration.minutes,
        spentTime: randomSpentTime // random spentTime between 80% and 100% of the time
    };
};

const generateRandomData = (numberItems, durations) => {
    // obtain range timestamps
    const currentTimeMilliseconds = new Date().getTime();
    const oneWeekAgoMilliseconds = subtractDaysFromDate(currentTimeMilliseconds, 7);

    console.log(`valores para rangear`);
    console.log(oneWeekAgoMilliseconds, currentTimeMilliseconds);

    const tasks = [];

    for (let i = 1; i <= numberItems; i++) {
        const durationInformation = getRandomDurationForTask(durations, oneWeekAgoMilliseconds, currentTimeMilliseconds);
        const task = {
            title: `Tarea ${i}`,
            description: `Descripcion ${i}`,
            type: `task`,
            status: `FINISHED`,
            ...durationInformation
        };
        tasks.push(task);
    }
    return tasks;
};

const getTasks = async () => {
    try {
        // check if there are durations
        const durations = await getDurations();

        const KeyConditionExpression = "#type = :type";
        const ExpressionAttributeNames = {
            "#type": "type"
        };
        const ExpressionAttributeValues = {
            ":type": "task"
        };

        const tasksByStatusResponse = await getTasksByParams({
            KeyConditionExpression,
            ExpressionAttributeNames,
            ExpressionAttributeValues
        });

        console.log(`respuesta de las tareas`, tasksByStatusResponse);

        // if there is not tasks create 50
        if (!tasksByStatusResponse ||
            tasksByStatusResponse.Count === 0) {
            console.log('creando tareas');
            const dataGenerated = generateRandomData(10, durations);

            // save in database each task
            await Promise.all(dataGenerated.map(async task => {
                await createTask(task, false);
            }));

            return dataGenerated;
        }
        return tasksByStatusResponse.Items;
    } catch (e) {
        console.error(`Error getting tasks`, e);
        return [];
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
            if (_.isEmpty(query) && _.isEmpty(body)) {
                const tasks = await getTasks();
                response = utils.constructSuccessResponse({
                    type: `TASKS_FOUND`,
                    data: tasks
                });
                statusResponseCode = 200;
            } else if (query.hasOwnProperty('status')) {
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
