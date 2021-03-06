import db from '../../lib/db';
import utils from '../../lib/utils';

// get number in 2 digits format to display
const getNumberInTwoDigits = number => number < 10 ?
    `0${number}`:
    number;

// get formated date using a date object
const getFormatDateByDate = date =>
    `${date.getFullYear()}/${getNumberInTwoDigits(date.getMonth() + 1)}/${getNumberInTwoDigits(date.getDate())}`;

// get just seconds from minutes and seconds
const getSecondsFromMinutesSeconds = ({
    minutes,
    seconds
}) =>
    minutes * 60 + (seconds || 0);

// convert tasks array into object where the key is the day formated
const getTasksSplitByDay = tasks => tasks.reduce((tasksSplitByDay, task) => {
    const date = new Date(task.timestamp);
    const dateFormated = getFormatDateByDate(date); //FORMAT YYYY/MM/DD

    if (tasksSplitByDay[dateFormated]) { // increment count
        tasksSplitByDay[dateFormated].value += 1;
    } else { // create item
        tasksSplitByDay[dateFormated] = {
            tasks: [],
            value: 1,
            dayOfWeek: date.getDay(),
            dateFormated,
            totalPosibleTimeSeconds: 0,
            totalSpentTime: 0,
            x: 0,
            y: 0
        };
    }

    tasksSplitByDay[dateFormated].totalSpentTime += task.spentTime;
    tasksSplitByDay[dateFormated].totalPosibleTimeSeconds += getSecondsFromMinutesSeconds(task);
    tasksSplitByDay[dateFormated].tasks.push(task);

    return tasksSplitByDay;
}, {});

const objectToArray = object => Object.values(object);

// get tasks from database using a query
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

// get tasks between range from database 
const getTasksByRangeDates = async (dayStartMilliseconds, dayEndMilliseconds) => {
    try {
        const KeyConditionExpression = '#type = :type AND #timestamp BETWEEN :startMilliseconds AND :endMilliseconds';
        const ExpressionAttributeNames = {
            '#type': 'type',
            '#timestamp': 'timestamp',
            '#status': 'status'
        };
        const ExpressionAttributeValues = {
            ':type': 'task',
            ':startMilliseconds': dayStartMilliseconds,
            ':endMilliseconds': dayEndMilliseconds,
            ':status': 'FINISHED'
        };
        const FilterExpression = `#status = :status`;

        const dynamoResponse = await getTasksByParams({
            KeyConditionExpression,
            ExpressionAttributeNames,
            ExpressionAttributeValues,
            FilterExpression
        });

        return dynamoResponse.Items || [];
    } catch (e) {
        console.error(`Error getting tasks by dates`, e);
        utils.constructCustomErrorByType('GETTING_TASK');
    }
};

const getMillisecondsFromDate = dateToProcess => new Date(dateToProcess).getTime(); // FORMAT YYYY/MM/DD

const subtractDaysFromDate = (dateMilliseconds, daysToSubtract) => {
    let date = new Date(dateMilliseconds);
    return date.setDate(date.getDate() - daysToSubtract);
};

// timestamp get max timestamps value posible for the day
const getEndTimestamp = dayEndMilliseconds => {
    const endDate = new Date(dayEndMilliseconds);
    const endDateFormated = getFormatDateByDate(endDate);
    const endDateMax = subtractDaysFromDate(new Date(endDateFormated).getTime(), -1);
    return endDateMax - 1;
};

const getTasksByRange =  async ({
    dayStart,
    dayEnd
}) => {
    try {
        // if doesnt provide dayEnd set today date
        const dayEndMilliseconds = dayEnd ?
            getEndTimestamp(getMillisecondsFromDate(dayEnd)) :
            getEndTimestamp(Date.now());
        // if doesnt provide days, set dayEnd today and for dayStart subtract 1 week
        const dayStartMilliseconds = dayStart ?
            getMillisecondsFromDate(dayStart) :
            subtractDaysFromDate(dayEndMilliseconds, 7);

        if (!dayStart && dayEnd ||
            dayStart > dayEnd) { // return error
            utils.constructCustomErrorByType('QUERY_ERROR');
        }
        
        const tasksByRange =  await getTasksByRangeDates(dayStartMilliseconds, dayEndMilliseconds);

        return tasksByRange;
    } catch (e) {
        throw e;
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
            let dynamoResponse = await getTasksByRange(query);
            let data = [];

            // get data according type
            switch (query.type) {
                case 'BAR_DAY_TASK':
                    data = objectToArray(getTasksSplitByDay(dynamoResponse));
                    break;
                case 'BAR_SPENT_TIME':
                    data = [];
                    break;
                default:
                    break;
            }

            response = utils.constructSuccessResponse({
                type: `LIST_FOUND`,
                data
            });
            statusResponseCode = 201;
        }
    } catch (e) {
        response = utils.constructErrorResponse(e);
    }
    res.status(statusResponseCode).json(response);
};

export default handler;
