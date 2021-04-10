import initialDurations from './durations.json';
import db from '../../../lib/db';
import validation from '../../../lib/validation/duration';
import utils from '../../../lib/utils';

const formatTime = ({
    minutes,
    seconds
}) => `(${minutes} minutos${seconds ? `, ${seconds} segundos` : ``})`;

const formatDurationCreateData = data => {
    const timestamp = data.timestamp || Date.now();
    return {
        ...data,
        timestamp,
        type: `duration`,
        value: timestamp
    };
};

const formatDurationsArray = durations => durations.reduce((newArray, duration) => {
    const durationFormated = {
        ...duration,
        label: `${duration.label} ${formatTime(duration)}`
    };
    newArray.push(durationFormated);
    return newArray;
}, []);

const createDuration = async duration => {
    try {
        const requestBodyValidated = validation.validateCreate(formatDurationCreateData(duration));
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

const getDurationsByParams = async _params => {
    try {
        const params = {
            TableName: process.env.REACT_APP_DYNAMODB_TABLE_NAME,
            ..._params
        };

        return await db.query(params).promise();
    } catch (e) {
        console.error(`Error getting durations by query`, e);
        utils.constructCustomErrorByType();
    }
};

const handler = async ({
    method,
    body
}, res) => {
    let statusResponseCode = 403; // forbbiden as default status code
    let response = ``;

    try {
        if (method === 'GET') { // get all durations
            const KeyConditionExpression = "#type = :type";
            const ExpressionAttributeNames = {
                "#type": "type"
            };
            const ExpressionAttributeValues = {
                ":type": "duration"
            };

            let dynamoResponse = await getDurationsByParams({
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

            response = utils.constructSuccessResponse({
                type: `DURATION_FOUND`,
                data: formatDurationsArray(dynamoResponse.Items || dynamoResponse)
            });
            statusResponseCode = 200;
        } else if (method === 'POST') { //create duration
            //validate request body
            const bodyObject = JSON.parse(body);
            const requestBodyValidated = await createDuration(bodyObject);

            // get all durations to return the newest values
            const KeyConditionExpression = "#type = :type";
            const ExpressionAttributeNames = {
                "#type": "type"
            };
            const ExpressionAttributeValues = {
                ":type": "duration"
            };

            let dynamoResponse = await getDurationsByParams({
                KeyConditionExpression,
                ExpressionAttributeNames,
                ExpressionAttributeValues
            });

            response = utils.constructSuccessResponse({
                type: `DURATION_CREATED`,
                data: {
                    itemAdded: requestBodyValidated,
                    list: formatDurationsArray(dynamoResponse.Items || [])
                }
            });
            statusResponseCode = 201;
        }
    } catch (e) {
        console.error(`Error in durations`, e);
        response = utils.constructErrorResponse(e);
    }
    res.status(statusResponseCode).json(response);
};

export default handler;
