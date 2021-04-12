import _ from 'lodash';

import db from '../../../lib/db';
import validation from '../../../lib/validation/task';
import validationDuration from '../../../lib/validation/duration';
import utils from '../../../lib/utils';
import initialDurations from '../duration/durations.json';

// format tasks data to save in database

const formatTaskCreateData = data => {
    const timestamp = data.timestamp || Date.now();
    return {
        ...data,
        timestamp,
        type: `task`,
        status: `PENDING`
    };
};

// format duration data to save in database

const formatDurationCreateData = data => {
    const timestamp = data.timestamp || Date.now();
    return {
        ...data,
        timestamp,
        type: `duration`,
        value: timestamp
    };
};

// create task in database

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

// query in database using params
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

// get item from database by key

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

// get tasks ordered by duration type

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

// update list of pending task to persist order

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

// create duration in database
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

// get all durations from database
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

// subtract days from date variable

const subtractDaysFromDate = (dateMilliseconds, daysToSubtract) => {
    let date = new Date(dateMilliseconds);
    return date.setDate(date.getDate() - daysToSubtract);
};

// convert minutes and seconds in just seconds

const getSecondsFromMinutesSeconds = ({
    minutes,
    seconds
}) =>
    minutes * 60 + (seconds || 0);

// get random value between ranges
const getRandomValueBetweenRange = (max, min) => 
    Math.floor(Math.random() * (max - min + 1)) + min;

// get random duration attributes to set in a task
const getRandomDurationForTask = (
    durations,
    startMilliseconds,
    endMilliseconds
) => {
    const randomTimestamp = getRandomValueBetweenRange(startMilliseconds, endMilliseconds);
    const randomDurationIndex = Math.floor(Math.random() * durations.length);
    const duration = durations[randomDurationIndex];
    const durationSeconds = getSecondsFromMinutesSeconds(duration);
    const randomSpentTime = getRandomValueBetweenRange(durationSeconds, Math.round(durationSeconds * .80));

    return {
        duration: duration.timestamp, // random duration
        timestamp: randomTimestamp, // random timestamp using range
        seconds: duration.seconds,
        minutes: duration.minutes,
        spentTime: randomSpentTime // random spentTime between 80% and 100% of the time
    };
};

// generate random tasks data, depends of numberItems
const generateRandomData = (numberItems, durations) => {
    // obtain range timestamps
    const currentTimeMilliseconds = new Date().getTime();
    const oneWeekAgoMilliseconds = subtractDaysFromDate(currentTimeMilliseconds, 7);

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

// get all tasks from database
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

        // if there is not tasks create 50
        if (!tasksByStatusResponse ||
            tasksByStatusResponse.Count === 0) {
            const dataGenerated = generateRandomData(50, durations);

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
            // get all tasks
            if (_.isEmpty(query) && _.isEmpty(body)) {
                const tasks = await getTasks();
                response = utils.constructSuccessResponse({
                    type: `TASKS_FOUND`,
                    data: tasks
                });
                statusResponseCode = 200;
            } else if (query.hasOwnProperty('status')) { // get tasks by status: pending or finished
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
                Item: _Item
            } = await getByKey(Key);

            const Item = _Item ? _Item.list : [];

            Item.push(newTask);

            // update the list
            await updateTaskOrderList(Item);

            response = utils.constructSuccessResponse({
                type: `TASK_CREATED`,
                data: {
                    itemAdded: newTask,
                    lists: {
                        ...getOrderedTask(Item),
                        pendingOrdered: Item
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
