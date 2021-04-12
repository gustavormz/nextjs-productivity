import db from '../../lib/db';
import utils from '../../lib/utils';
import validationDuration from '../../lib/validation/duration';
import initialDurations from './duration/durations.json';
import validation from '../../lib/validation/task';

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

// update list in database
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

// get item from database using a key
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

// ordered tasks by duration type
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
    body
}, res) => {
    let statusResponseCode = 403; // forbbiden as default status code
    let response = ``;

    try {
        // check if there are tasks on database
        await getTasks();

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
