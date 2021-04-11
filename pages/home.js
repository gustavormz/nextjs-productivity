import PropTypes from 'prop-types';
import {
    useState,
    useEffect
} from 'react';

import Head from '../src/components/head/home';
import LayoutBase from '../src/components/layout/base';
import Page from '../src/pages/home/page';
import Static from '../src/pages/home/static';
import DialogTaskCreate from '../src/components/dialog/task/create';
import DialogLoaderFullscreenCircular from '../src/components/dialog/loader/fullscreenCircular';
import DialogResponse from '../src/components/dialog/response';
import DialogTaskEdit from '../src/components/dialog/task/edit';
import DialogTaskDeleteConfirm from '../src/components/dialog/task/delete';
import DialogTaskFinishConfirm from '../src/components/dialog/task/finish';

const getValueFromEvent = event => event.target.value;

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

const orderTasks = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
};

const updateCurrentOrderList = async (baseApiUrl, orderedList) => {
    try {
        // save current order list
        return await fetch(`${baseApiUrl}/list`, {
            method: 'PUT',
            body: JSON.stringify(orderedList)
        });
    } catch (e) {
        console.error(`Error updating ordered list`, e);
        throw e;
    }
};

const getTimeSecondsFromDurationId = (durations, durationId) => {
    for (let duration of durations) {
        if (duration.timestamp === durationId) {
            const {
                minutes,
                seconds
            } = duration;
            return (minutes * 60) + (seconds || 0);
        }
    }
};

const Home = ({
    baseApiUrl
}) => {
    const [state, setState] = useState({
        isRequesting: false,
        isDialogTaskCreateOpen: false,
        newTask: undefined,
        dialogResponseType: `default`,
        isError: false,
        isDialogResponseOpen: false,
        updateTask: undefined,
        isDialogTaskEditOpen: false,
        isDialogTaskDeleteConfirmOpen: false,
        deleteTask: undefined,
        isDialogTaskFinishConfirmOpen: false,
        finishTask: undefined,
        tabActive: 0,
        selectTaskDuration: `ALL`
    });
    const [finishedTasks, setFinishedTasks] = useState([]);
    const [tasks, setTasks] = useState(undefined);
    const [durations, setDurations] = useState([]);
    const [tasksShow, setTasksShow] = useState(undefined);


    function handleSelectTaskDefaultDurationChange (event) {
        event.preventDefault();
        const value = getValueFromEvent(event);

        let newTasks = tasks;

        if (value !== 'ALL') {
            let timeTopLimitSeconds = 60 * 60 * 2;
            let timeBottomLimitSeconds = 60 * 60;
            
            if (value === 'SHORT') {
                timeTopLimitSeconds = 60 * 30;
                timeBottomLimitSeconds = 0;
            } else if (value === 'MEDIUM') {
                timeTopLimitSeconds = 60 * 60;
                timeBottomLimitSeconds = 60 * 30;
            }

            newTasks = tasks.reduce((tasksReturn, task) => {
                const taskDurationSeconds = getTimeSecondsFromDurationId(durations, task.duration);
                if (taskDurationSeconds > timeBottomLimitSeconds &&
                    taskDurationSeconds <= timeTopLimitSeconds) {
                    tasksReturn.push(task);
                }
                return tasksReturn;
            }, []);
        }

        setTasksShow(newTasks);
        setState({
            ...state,
            isRequesting: false,
            selectTaskDuration: value
        });
    }

    function handleTabChange (event, index) {
        setState({
            ...state,
            tabActive: index
        });
    }

    function handleDialogTaskCreateClose () {
        setState({
            ...state,
            isDialogTaskCreateOpen: false
        });
    }

    function handleNewTaskButtonClick () {
        setState({
            ...state,
            isDialogTaskCreateOpen: true
        });
    }

    async function handleDialogTaskCreateFormSubmit (values) {
        setState({
            ...state,
            isRequesting: true,
            newTask: values
        });

        let dialogResponseType = undefined;
        let durationResponse = undefined;
        let isError = false;

        if (values.duration === `custom`) {
            durationResponse = await (await fetch(`${baseApiUrl}/duration`, {
                method: 'POST',
                body: JSON.stringify({
                    ...values,
                    label: values.duration_title
                })
            })).json();

            if (durationResponse.error) {
                dialogResponseType = durationResponse.errorType;
                isError = true;
            } else {
                const durationsCopy = [...durations];
                durationsCopy.push(durationResponse.data);
                setDurations(durationsCopy);

                const response = await (await fetch (`${baseApiUrl}/task`, {
                    method: `POST`,
                    body: JSON.stringify(values)
                })).json();
        
                if (!response.error) {
                    const tasksCopy = [...tasks];
                    tasksCopy.push(response.data);
                    setTasks(tasksCopy);

                    // save current order list
                    
                    await updateCurrentOrderList(baseApiUrl, tasksCopy);
                }
                isError = response.error;
                dialogResponseType = response.errorType || response.successType
            }
        } else {
            const response = await (await fetch (`${baseApiUrl}/task`, {
                method: `POST`,
                body: JSON.stringify(values)
            })).json();
    
            if (!response.error) {
                const tasksCopy = [...tasks];
                tasksCopy.push(response.data);
                setTasks(tasksCopy);

                // save current order list
                await updateCurrentOrderList(baseApiUrl, tasksCopy);
            }

            isError = response.error;
            dialogResponseType = response.errorType || response.successType;
        }

        setState({
            ...state,
            isRequesting: false,
            isError,
            dialogResponseType,
            isDialogResponseOpen: true,
            isDialogTaskCreateOpen: isError,
            newTask: isError ?
                values:
                undefined
        });
    }

    function handleDialogResponseClose () {
        setState({
            ...state,
            isDialogResponseOpen: false
        });
    }

    function handleEditClick (task) {
        setState({
            ...state,
            updateTask: task,
            isDialogTaskEditOpen: true
        });
    }

    function handleDialogTaskEditClose () {
        setState({
            ...state,
            isDialogTaskEditOpen: false
        });
    }

    async function handleDialogTaskEditFormSubmit (values) {
        setState({
            ...state,
            isRequesting: true,
            updateTask: values
        });

        const response = await (await fetch (`${baseApiUrl}/task/${values.timestamp}`, {
            method: `PUT`,
            body: JSON.stringify(values)
        })).json();

        // if there isnt error update the item on the array
        if (!response.error) {
            const newTasks = updateTaskByIdFromArray(tasks, values.timestamp, values);
            setTasks(newTasks);
            
            // save current order list
            await updateCurrentOrderList(baseApiUrl, newTasks);
        }

        setState({
            ...state,
            isRequesting: false,
            isError: response.error,
            dialogResponseType: response.errorType || response.successType,
            isDialogResponseOpen: true,
            isDialogTaskEditOpen: response.error,
            updateTask: response.error ?
                values :
                undefined
        });
    }

    function handleDeleteClick (task) {
        setState({
            ...state,
            isDialogTaskDeleteConfirmOpen: true,
            deleteTask: task
        });
    }

    async function handleDialogTaskDeleteConfirm () {
        setState({
            ...state,
            isRequesting: true
        });

        const response = await (await fetch(`${baseApiUrl}/task/${state.deleteTask.timestamp}`, {
            method: `DELETE`
        })).json();

        if (!response.error) {
            const newTasks = removeTaskByIdFromArray(tasks, state.deleteTask.timestamp);
            setTasks(newTasks);
            
            // save current order list
            await updateCurrentOrderList(baseApiUrl, newTasks);
        }

        setState({
            ...state,
            isDialogTaskDeleteConfirmOpen: response.error,
            deleteTask: response.error ?
                state.deleteTask :
                undefined
        });
    }

    function handleDialogTaskDeleteClose () {
        setState({
            ...state,
            isDialogTaskDeleteConfirmOpen: false
        });
    }

    async function onDragEnd (result) {
        // dropped outside the list
        if (!result.destination || result.destination.index === result.source.index) {
            return;
        }

        setState({
            ...state,
            isRequesting: true
        });

        const tasksOrdered = orderTasks(
            tasks,
            result.source.index,
            result.destination.index
        );
        setTasks(tasksOrdered);
        
        // save current order list
        await updateCurrentOrderList(baseApiUrl, tasksOrdered);

        setState({
            ...state,
            isRequesting: false
        });
    }

    function handleTimekeeperFinish (seconds) {
        
    }

    function handleDialogTaskFinishClose () {
        setState({
            ...state,
            isDialogTaskFinishConfirmOpen: false
        });
    }

    async function handleDialogTaskFinishConfirm () {
        setState({
            ...state,
            isRequesting: true
        });

        const response = await (await fetch(`${baseApiUrl}/task/${state.finishTask.timestamp}?status=finish`, {
            method: `PUT`
        })).json();

        if (!response.error) {
            const newTasks = updateTaskByIdFromArray(tasks, state.finishTask.timestamp, {
                ...state.finishTask,
                status: `FINISHED`
            });
            setTasks(newTasks);
            
            // save current order list
            await updateCurrentOrderList(baseApiUrl, newTasks);
        }

        setState({
            ...state,
            isDialogTaskFinishConfirmOpen: response.error,
            finishTask: response.error ?
                state.finishTask :
                undefined
        });
    }

    function handleFinishClick (task) {
        setState({
            ...state,
            isDialogTaskFinishConfirmOpen: true,
            finishTask: task
        });
    }

    return (
        <LayoutBase maxWidth={'md'}>
            <Head />
            { state.deleteTask && (
                <DialogTaskDeleteConfirm
                    handleClose={handleDialogTaskDeleteClose}
                    handleConfirm={handleDialogTaskDeleteConfirm}
                    id={state.deleteTask.timestamp}
                    open={state.isDialogTaskDeleteConfirmOpen}
                    title={state.deleteTask.title}/>
            ) }
            { state.finishTask && (
                <DialogTaskFinishConfirm
                handleClose={handleDialogTaskFinishClose}
                handleConfirm={handleDialogTaskFinishConfirm}
                id={state.finishTask.timestamp}
                open={state.isDialogTaskFinishConfirmOpen}
                title={state.finishTask.title}/>
            ) }
            <DialogResponse
                handleClose={handleDialogResponseClose}
                open={state.isDialogResponseOpen}
                type={state.dialogResponseType}/>
            <DialogLoaderFullscreenCircular open={state.isRequesting}/>
            <DialogTaskCreate
                durations={durations}
                finalValues={state.newTask}
                handleClose={handleDialogTaskCreateClose}
                handleFormSubmit={handleDialogTaskCreateFormSubmit}
                open={state.isDialogTaskCreateOpen}/>
            <DialogTaskEdit
                durations={durations}
                finalValues={state.updateTask}
                handleClose={handleDialogTaskEditClose}
                handleFormSubmit={handleDialogTaskEditFormSubmit}
                open={state.isDialogTaskEditOpen}/>
            <Page
                handleTabChange={handleTabChange}
                tabActive={state.tabActive} />
        </LayoutBase>
    );
};

Home.propTypes = {
    baseApiUrl: PropTypes.string
};

Home.defaultProps = {
    baseApiUrl: `/api`
};

export default Home;
