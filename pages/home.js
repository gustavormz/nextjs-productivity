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
    for (let i; i < tasks.length; i++) {
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

const updateCurrentOrderList = async orderedList => {
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
        deleteTask: undefined
    });
    const [tasks, setTasks] = useState(undefined);
    const [durations, setDurations] = useState([])
    
    useEffect(() => {
        async function fetchTaskAndDurations () {
            const responses = await Promise.all([
                await fetch(`${baseApiUrl}/task`),
                await fetch(`${baseApiUrl}/duration`)
            ]);

            const tasksToSet = await (responses[0]).json();
            const durationsToSet = await (responses[1]).json();
            durationsToSet.data.push({
                label: `Personalizar`,
                value: `custom`
            });

            setTasks(tasksToSet.data);
            setDurations(durationsToSet.data);
        }
        fetchTaskAndDurations();
    }, []);

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
                    await updateCurrentOrderList(tasksCopy);
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
                await updateCurrentOrderList(tasksCopy);
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
        console.log(task);
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
            await updateCurrentOrderList(newTasks);
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
            await updateCurrentOrderList(newTasks);
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
        setState({
            ...state,
            isRequesting: true
        });

        // dropped outside the list
        if (!result.destination) {
            return;
        }
        const tasksOrdered = orderTasks(
            tasks,
            result.source.index,
            result.destination.index
        );
        setTasks(tasksOrdered);
        
        // save current order list
        await updateCurrentOrderList(tasksOrdered);

        setState({
            ...state,
            isRequesting: false
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
            { tasks ? (
                <Page
                    onDragEnd={onDragEnd}
                    handleDeleteClick={handleDeleteClick}
                    durations={durations}
                    handleEditClick={handleEditClick}
                    handleNewTaskButtonClick={handleNewTaskButtonClick}
                    tasks={tasks}/>
            ) : (
                <Static />
            ) }
        </LayoutBase>
    );
};

export const getServerSideProps = () => {
    const baseApiUrl = `/api`;

    return {
        props: {
            baseApiUrl
        }
    };
};

Home.propTypes = {
    baseApiUrl: PropTypes.string
};

export default Home;
