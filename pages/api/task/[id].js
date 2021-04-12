import db from '../../../lib/db';
import utils from '../../../lib/utils';
import validation from '../../../lib/validation/task';

// delete task from the database
const deleteTask = async id => {
    try {
        const params = {
            TableName: process.env.REACT_APP_DYNAMODB_TABLE_NAME,
            Key: {
                type: `task`,
                timestamp: parseInt(id)
            }
        };
        return await db.delete(params).promise();
    } catch (e) {
        console.error(`Error deleting task`, e);
        utils.constructCustomErrorByType('TASK_DELETE');
    }
};

// update task in database
const updateTask = async (id, dataToUpdate) => {
    try {
        const dataValidated = validation.validateUpdate(dataToUpdate);

        const Key = {
            type: `task`,
            timestamp: parseInt(id)
        };
        const UpdateExpression = `set #description = :description, #duration = :duration`;
        const ExpressionAttributeNames = {
            '#description': 'description',
            '#duration': 'duration'
        };
        const ExpressionAttributeValues = {
            ':description': dataValidated.description,
            ':duration': dataValidated.duration
        };
        const params = {
            TableName: process.env.REACT_APP_DYNAMODB_TABLE_NAME,
            Key,
            UpdateExpression,
            ExpressionAttributeNames,
            ExpressionAttributeValues
        };

        await db.update(params).promise();

        return dataValidated;
    } catch (e) {
        console.error(`Error updating task`, e);
        utils.constructCustomErrorByType(`TASK_UPDATE`);
    }
};

// change task status from pending to finish
const finishTask = async (id, {
    spentTime
}) => {
    try {
        const Key = {
            type: `task`,
            timestamp: parseInt(id)
        };
        const UpdateExpression = `set #status = :status, #spentTime = :spentTime`;
        const ExpressionAttributeNames = {
            '#status': 'status',
            '#spentTime': 'spentTime'
        };
        const ExpressionAttributeValues = {
            ':status': 'FINISHED',
            ':spentTime': spentTime,
        };
        const ConditionExpression = `#status = PENDING`;
        const params = {
            TableName: process.env.REACT_APP_DYNAMODB_TABLE_NAME,
            Key,
            UpdateExpression,
            ExpressionAttributeNames,
            ExpressionAttributeValues
        };

        return await db.update(params).promise();
    } catch (e) {
        console.error(`Error updating task`, e);
        utils.constructCustomErrorByType(`TASK_UPDATE`);
    }
};

// remove task from array using id
const removeTaskByIdFromArray = (_tasks, idTask) => {
    let indexToDelete = -1;
    const tasks = [..._tasks];
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].timestamp === idTask) {
            indexToDelete = i;
            break;
        }
    }
    tasks.splice(indexToDelete, 1);
    return tasks;
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
        utils.constructCustomErrorByType('GETTING_TASK');
    }
};

// update pending order list in database
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

// update task in array using id

const updateTaskByIdFromArray = (_tasks, idTask, newData) => {
    const tasks = [..._tasks];
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].timestamp === idTask) {
            tasks[i] = { ...newData };
            break;
        }
    }
    return tasks;
};

const handler = async ({
    method,
    body,
    query
}, res) => {
    let statusResponseCode = 403; // forbbiden as default status code
    let response = ``;

    try {
        if (method === 'DELETE') {
            await deleteTask(query.id);

            // get lastest tasks to delete the task
            const Key = {
                type: `list`,
                timestamp: 1
            };
            const {
                Item
            } = await getByKey(Key);

            const newList = removeTaskByIdFromArray(Item.list, parseInt(query.id));

            // update the list
            await updateTaskOrderList(newList);

            response = utils.constructSuccessResponse({
                type: `TASK_DELETED`,
                data: {
                    itemRemoved: query.id,
                    lists: {
                        ...getOrderedTask(newList),
                        pendingOrdered: newList
                    }
                }
            });
            statusResponseCode = 200;
        } else if (method === 'PUT') {
            if (query.hasOwnProperty('id') &&
                body &&
                query.hasOwnProperty('status') &&
                query.status === 'FINISH') {

                const bodyObject = JSON.parse(body);
                const updateResponse  = await finishTask(query.id, bodyObject);

                // get lastest tasks to update the task
                const Key = {
                    type: `list`,
                    timestamp: 1
                };
                const {
                    Item
                } = await getByKey(Key);

                const updatedList = removeTaskByIdFromArray(Item.list, parseInt(query.id));

                // update the list
                await updateTaskOrderList(updatedList);

                response = utils.constructSuccessResponse({
                    type: `TASK_FINISHED`,
                    data: {
                        itemUpdated: bodyObject,
                        lists: {
                            ...getOrderedTask(updatedList),
                            pendingOrdered: updatedList
                        }
                    }
                });
                statusResponseCode = 201;
            } else if (query.hasOwnProperty('id') && body) {
                const bodyObject = JSON.parse(body);
                const updateResponse  = await updateTask(query.id, bodyObject);

                // get lastest tasks to delete the task
                const Key = {
                    type: `list`,
                    timestamp: 1
                };
                const {
                    Item
                } = await getByKey(Key);

                const updatedList = updateTaskByIdFromArray(Item.list, parseInt(query.id), bodyObject);

                // update the list
                await updateTaskOrderList(updatedList);

                response = utils.constructSuccessResponse({
                    type: `TASK_UPDATED`,
                    data: {
                        itemUpdated: updateResponse,
                        lists: {
                            ...getOrderedTask(updatedList),
                            pendingOrdered: updatedList
                        }
                    }
                });
                statusResponseCode = 201;
            } else if (query.hasOwnProperty('status') &&
                query.hasOwnProperty('id')) { // finish task

                const updateResponse  = await finishTask(query.id);
                response = utils.constructSuccessResponse({
                    type: `TASK_FINISHED`,
                    data: updateResponse
                });
                statusResponseCode = 201;
            }
        }
    } catch (e) {
        response = utils.constructErrorResponse(e);
    }
    res.status(statusResponseCode).json(response);
};

export default handler;
