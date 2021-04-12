import PropTypes from 'prop-types';
import {
    useEffect,
    useState,
    useRef
} from 'react';
import {
    Grid,
    RootRef,
    List,
    Backdrop
} from '@material-ui/core';
import {
    DragDropContext,
    Droppable,
    Draggable
} from 'react-beautiful-dnd';

import TimekeeperBase from '../../timekeeper/base';
import SelectTaskDefaultDuration from '../../ui/select/task/defaultDuration';
import ButtonSecondary from '../../ui/button/secondary';
import DialogTaskCreate from '../../dialog/task/create';
import DividerBase from '../../divider/base';
import PaperSimpleWrapperText from '../../paper/simpleWrapperText';
import ButtonBase from '../../ui/button/base';
import ListItemTask from '../../list/item/task';
import DialogLoaderFullscreenCircular from '../../dialog/loader/fullscreenCircular';
import DialogTaskDeleteConfirm from '../../dialog/task/delete';
import DialogTaskUpdate from '../../dialog/task/edit';

const getValueFromEvent = event => event.target.value;

const getTasksToRenderByDurationType = (tasks, durationType) => {
    let tasksToReturn = [];

    switch (durationType) {
        case 'ALL':
            tasksToReturn = [...tasks.pendingOrdered];
            break;
        case 'SHORT':
            tasksToReturn = [...tasks.pendingShort];
            break;
        case 'MEDIUM':
            tasksToReturn = [...tasks.pendingMedium];
            break;
        default: // LONG
            tasksToReturn = [...tasks.pendingLong];
            break;
    }

    return tasksToReturn;
}; 

const orderTasks = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
};

const getItemStyle = (isDragging, draggableStyle) => ({
    ...draggableStyle,

    // styles when drag item
    ...(isDragging && {
        background: "rgb(235,235,235)"
    })
});

const getDataFromDynamoResponse = dynamoResponse => dynamoResponse.error ?
    [] :
    dynamoResponse.data;

const getMInutesAndSecondsFromDurationsByDurationId = (durations, durationId) => {
    for (let duration of durations) {
        if (duration.timestamp === durationId) {
            return {
                minutes: duration.minutes,
                seconds: duration.seconds
            };
        }
    }
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
    }
};

const getSecondsByMinutesAndSeconds = ({
    minutes,
    seconds
}) => minutes * 60 + (seconds || 0);

const getTimeByTask = task => getSecondsByMinutesAndSeconds(task);

const getSpentTime = (task, finalTime) => getSecondsByMinutesAndSeconds(task) - finalTime; 

const TabPaneTaskPending = ({
    baseApiUrl,
    callapi,
    prevStateKey,
    ...props
}) => {
    const [state, setState] = useState({
        isRequesting: false,
        timekeeperInitialTime: 10,
        selectTaskDurationValue: `ALL`,
        isDialogTaskCreateOpen: false,
        newTask: undefined,
        request: {
            isError: false,
            responseType: undefined
        },
        isDialogResponseOpen: false,
        isTasksToSort: true,
        deleteTask: undefined,
        isDialogTaskDeleteOpen: false,
        updateTask: undefined,
        isDialogTaskUpdateOpen: false,
        finishTask: undefined,
        isTaskStarted: false,
        curseTask: undefined
    });
    const [tasks, setTasks] = useState({
        pendingOrdered: undefined,
        pendingShort: [],
        pendingMedium: [],
        pendingLong: []
    });
    const [durations, setDurations] = useState([]);
    const [timekeeper, setTimekeeper] = useState({
        seconds: 0,
        isActive: false,
        state: `STOP`
    });
    const [curseTask, setCurseTask] = useState(undefined);

    const intervalTimekeeperReference = useRef(null);

    function handleTimekeeperPause () {
        if (!intervalTimekeeperReference.current) {
            return;
        }
        clearInterval(intervalTimekeeperReference.current);
        setTimekeeper({
            ...timekeeper,
            isActive: false,
            state: 'PAUSE'
        });
        intervalTimekeeperReference.current = null;
    }

    function handleTimekeeperReset () {
        clearInterval(intervalTimekeeperReference.current);
        const initialSeconds = getTimeByTask(curseTask);
        setTimekeeper({
            isActive: false,
            seconds: initialSeconds,
            state: 'RESET'
        });
        intervalTimekeeperReference.current = null;
    }

    function handleTimekeeperStop () {
        clearInterval(intervalTimekeeperReference.current);
        setTimekeeper({
            isActive: false,
            seconds: null,
            state: 'STOP'
        });
        intervalTimekeeperReference.current = null;
    }

    async function handleTimekeeperResume () {
        if (intervalTimekeeperReference.current) {
            return;
        }
        intervalTimekeeperReference.current = setInterval(function () {
            setTimekeeper(timekeeper => ({
                ...timekeeper,
                seconds: timekeeper.seconds - 1,
                isActive: true,
                state: 'PLAY'
            }));
        }, 1000);
    }

    // useEffect to finish task when counter is 0
    useEffect(function () {
        async function finishTask (task) {
            setState({
                ...state,
                finishTask: task,
                isRequesting: true
            });
    
            handleTimekeeperPause();
            const spentTimeSeconds = getSpentTime(task, timekeeper.seconds);
    
            const response = await (await fetch (`${baseApiUrl}/task/${curseTask.timestamp}?status=FINISH`, {
                method: 'PUT',
                body: JSON.stringify({
                    ...curseTask,
                    spentTime: spentTimeSeconds
                })
            })).json();
    
            if (!response.error) {
                setTasks(response.data.lists);
            }
    
            setState({
                ...state,
                isRequesting: false,
                finishTask: undefined
            });
            setCurseTask(undefined);
        }

        // save current time to persist timekeeper yet the user close tab
        function saveCurrentTime () {
            localStorage.setItem(prevStateKey, JSON.stringify({
                timekeeper,
                task: curseTask
            }));
        }

        if (intervalTimekeeperReference.current) {
            saveCurrentTime();
        }

        if (intervalTimekeeperReference.current &&
                timekeeper.seconds === 0) {
            handleTimekeeperStop();
            finishTask(curseTask);
        }
    }, [timekeeper.seconds]);

    useEffect(function () {
        function persisteState () {
            const prevState = JSON.parse(localStorage.getItem(prevStateKey));
            if (prevState && prevState.task) {
                localStorage.clear();
                setCurseTask(prevState.task);
                setTimekeeper({
                    ...timekeeper,
                    ...prevState.timekeeper
                });
            }
        }

        persisteState();
        return () => {
            if (intervalTimekeeperReference.current) {
                clearInterval(intervalTimekeeperReference);
            }
        };
    }, []);

    useEffect(function () {
        async function fetchData () {
            setState({
                ...state,
                isRequesting: true
            });
            const responses = await Promise.all([
                await fetch(`${baseApiUrl}/list`),
                await fetch(`${baseApiUrl}/duration`)
            ]);
            const list = getDataFromDynamoResponse(await responses[0].json());
            const newDurations = getDataFromDynamoResponse(await responses[1].json());

            setTasks(list);
            setDurations(durations => newDurations.concat([{
                label: `Personalizar`,
                value: `custom`
            }]));
            setState({
                ...state,
                isRequesting: false
            });
        }

        fetchData();
    }, [callapi]);

    function handleSelectTaskDuration (event) {
        const selectValue = getValueFromEvent(event);
        setState({
            ...state,
            selectTaskDurationValue: selectValue
        });
    }

    function handleNewTaskButtonClick () {
        setState({
            ...state,
            isDialogTaskCreateOpen: true
        });
    }

    function handleDialogTaskCreateClose () {
        setState({
            ...state,
            isDialogTaskCreateOpen: false
        });
    }

    async function handleDialogTaskCreateFormSubmit (values) {
        setState({
            ...state,
            isRequesting: true,
            newTask: values
        });

        let requestResponseType = undefined;
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
                requestResponseType = durationResponse.errorType;
                isError = true;
            } else {
                setDurations(durationResponse.data.list);
            }
        }

        if (!isError) {
            const _values = values.duration === `custom` ? {
                ...values,
                duration: durationResponse.data.itemAdded.timestamp
            } : {
                ...values,
                ...getMInutesAndSecondsFromDurationsByDurationId(durations, values.duration)
            };

            const response = await (await fetch (`${baseApiUrl}/task`, {
                method: `POST`,
                body: JSON.stringify(_values)
            })).json();

            if (!response.error) {
                setTasks(response.data.lists);
            }
            isError = response.error;
            requestResponseType = response.errorType || response.successType;
        }

        setState({
            ...state,
            isRequesting: false,
            request: {
                isError,
                responseType: requestResponseType
            },
            isDialogResponseOpen: true,
            isDialogTaskCreateOpen: isError,
            newTask: isError ?
                values :
                undefined
        });
    }

    async function onDragEnd (result) {
        // dropped outside the list or doesnt position change
        if (!result.destination
            || result.destination.index === result.source.index
            || intervalTimekeeperReference.current
            || curseTask) {
            return;
        }

        if (state.selectTaskDurationValue === 'SHORT') {
            const tasksOrdered = orderTasks(
                tasks.pendingShort,
                result.source.index,
                result.destination.index
            );
            setTasks({
                ...tasks,
                pendingShort: tasksOrdered
            });
        } else if (state.selectTaskDurationValue === 'MEDIUM') {
            const tasksOrdered = orderTasks(
                tasks.pendingMedium,
                result.source.index,
                result.destination.index
            );
            setTasks({
                ...tasks,
                pendingMedium: tasksOrdered
            });
        } else if (state.selectTaskDurationValue === 'LONG') {
            const tasksOrdered = orderTasks(
                tasks.pendingLong,
                result.source.index,
                result.destination.index
            );
            setTasks({
                ...tasks,
                pendingLong: tasksOrdered
            });
        } else {
            setState({
                ...state,
                isRequesting: true
            });
            const tasksOrdered = orderTasks(
                tasks.pendingOrdered,
                result.source.index,
                result.destination.index
            );
            await updateCurrentOrderList(baseApiUrl, tasksOrdered);
            setTasks({
                ...tasks,
                pendingOrdered: tasksOrdered
            });
            setState({
                ...state,
                isRequesting: false
            });
        }
    }

    function handleDeleteTaskClick (task) {
        setState({
            ...state,
            deleteTask: task,
            isDialogTaskDeleteOpen: true
        });
    }

    function handleDialogTaskDeleteConfirmClose () {
        setState({
            ...state,
            isDialogTaskDeleteOpen: false
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
            setTasks(response.data.lists);
        }

        setState({
            ...state,
            isDialogTaskDeleteConfirmOpen: response.error,
            deleteTask: response.error ?
                state.deleteTask :
                undefined
        });
    }

    function handleDialogTaskUpdateClose () {
        setState({
            ...state,
            isDialogTaskUpdateOpen: false
        });
    }

    async function handleDialogTaskEditFormSubmit (values) {
        setState({
            ...state,
            isRequesting: true,
            updateTask: values
        });

        let requestResponseType = undefined;
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
                requestResponseType = durationResponse.errorType;
                isError = true;
            } else {
                setDurations(durationResponse.data.list);
            }
        }

        if (!isError) {
            const _values = values.duration === `custom` ? {
                ...values,
                duration: durationResponse.data.itemAdded.timestamp
            } : {
                ...values,
                ...getMInutesAndSecondsFromDurationsByDurationId(durations, values.duration)
            };

            const response = await (await fetch (`${baseApiUrl}/task/${values.timestamp}`, {
                method: `PUT`,
                body: JSON.stringify(_values)
            })).json();

            if (!response.error) {
                setTasks(response.data.lists);
            }
            isError = response.error;
            requestResponseType = response.errorType || response.successType;
        }

        setState({
            ...state,
            isRequesting: false,
            request: {
                isError,
                responseType: requestResponseType
            },
            isDialogResponseOpen: true,
            isDialogTaskEditOpen: isError,
            updateTask: isError ?
                values :
                undefined
        });
    }

    function handleEditTaskClick (task) {
        setState({
            ...state,
            updateTask: task,
            isDialogTaskUpdateOpen: true
        });
    }

    async function handleFinishTaskClick (task) {
        setState({
            ...state,
            finishTask: task,
            isRequesting: true
        });

        handleTimekeeperPause();
        const spentTimeSeconds = getSpentTime(task, timekeeper.seconds);

        const response = await (await fetch (`${baseApiUrl}/task/${curseTask.timestamp}?status=FINISH`, {
            method: 'PUT',
            body: JSON.stringify({
                ...curseTask,
                spentTime: spentTimeSeconds
            })
        })).json();

        if (!response.error) {
            setTasks(response.data.lists);
        }

        setState({
            ...state,
            isRequesting: false,
            finishTask: undefined
        });
        setCurseTask(undefined);
    }

    function handleTaskCancelClick (task) {
        setCurseTask(undefined);
        handleTimekeeperStop();
    }

    function handleStartTask (task) {
        setCurseTask(task);
        setTimekeeper({
            ...timekeeper,
            seconds: getTimeByTask(task)
        });
        handleTimekeeperResume();
    }

    return (
        <div
            style={{
                width: `100%`,
                padding: 10
            }}
            { ...props }>
            { state.deleteTask && (
                <DialogTaskDeleteConfirm
                    handleClose={handleDialogTaskDeleteConfirmClose}
                    handleConfirm={handleDialogTaskDeleteConfirm}
                    open={state.isDialogTaskDeleteOpen}
                    id={state.deleteTask.timestamp}
                    title={state.deleteTask.title}/>
            ) }
            { state.updateTask && (
                <DialogTaskUpdate
                    durations={durations}
                    handleClose={handleDialogTaskUpdateClose}
                    handleFormSubmit={handleDialogTaskEditFormSubmit}
                    open={state.isDialogTaskUpdateOpen}
                    finalValues={state.updateTask}/>
            ) }
            <DialogLoaderFullscreenCircular
                open={state.isRequesting}/>
            <DialogTaskCreate
                durations={durations}
                finalValues={state.newTask}
                handleClose={handleDialogTaskCreateClose}
                handleFormSubmit={handleDialogTaskCreateFormSubmit}
                open={state.isDialogTaskCreateOpen}/>
            <Grid
                spacing={2}
                container>
                { (curseTask) && (
                    <Grid
                        justify={'center'}
                        container
                        item
                        xs={12}>
                        <TimekeeperBase
                            handleStop={handleTimekeeperReset}
                            handlePause={handleTimekeeperPause}
                            handleReset={handleTimekeeperReset}
                            handleResume={handleTimekeeperResume}
                            initialTime={timekeeper.seconds}/>
                    </Grid>
                ) }
                <Grid
                    item
                    xs={12}
                    md={7}>
                    <SelectTaskDefaultDuration
                        disabled={
                            (intervalTimekeeperReference.current != null ||
                            curseTask) ? true : false
                        }
                        value={state.selectTaskDurationValue || `ALL`}
                        onChange={handleSelectTaskDuration}/>
                </Grid>
                <Grid
                    container
                    alignItems={'flex-end'}
                    item xs={12} md={5}>
                    <ButtonSecondary
                        disabled={
                            (intervalTimekeeperReference.current != null ||
                            curseTask) ? true : false
                        }
                        onClick={handleNewTaskButtonClick}>
                        Agregar Nueva Tarea
                    </ButtonSecondary>
                </Grid>
                <Grid item xs={12}>
                    <DividerBase />
                </Grid>
                { (tasks.pendingOrdered &&
                    tasks.pendingOrdered.length > 0) && (
                    <Grid item xs={12}>
                        
                        <DragDropContext onDragEnd={onDragEnd}>
                            <Droppable droppableId="droppable">
                                { (provided, snapshot) => (
                                    <RootRef rootRef={provided.innerRef}>
                                        <List>
                                            { getTasksToRenderByDurationType(tasks, state.selectTaskDurationValue)
                                                .map((task, index) => (
                                                <Draggable
                                                    key={task.timestamp}
                                                    draggableId={String(task.timestamp)}
                                                    index={index}>

                                                    { (provided, snapshot) => (
                                                        <ListItemTask
                                                            handleStart={
                                                                (index === 0 &&
                                                                    !curseTask) ?
                                                                handleStartTask :
                                                                null
                                                            }
                                                            handleFinishTask={(index === 0 &&
                                                                curseTask &&
                                                                timekeeper.state !== 'RESET') ?
                                                                handleFinishTaskClick :
                                                                null
                                                            }
                                                            handleEditClick={
                                                                curseTask ?
                                                                    null :
                                                                    handleEditTaskClick
                                                            }
                                                            handleDeleteClick={
                                                                (index === 0) ?
                                                                null :
                                                                handleDeleteTaskClick
                                                            }
                                                            handleCancel={
                                                                (index === 0 &&
                                                                    curseTask) ?
                                                                handleTaskCancelClick :
                                                                null
                                                            }
                                                            task={task}
                                                            ContainerComponent="li"
                                                            ContainerProps={{ ref: provided.innerRef }}
                                                            { ...provided.draggableProps }
                                                            { ...provided.dragHandleProps }
                                                            style={ getItemStyle(
                                                                snapshot.isDragging,
                                                                provided.draggableProps.style
                                                            )} />
                                                    )}
                                                </Draggable>
                                            ))}
                                            { provided.placeholder }
                                        </List>
                                    </RootRef>
                                )}
                            </Droppable>
                        </DragDropContext>

                    </Grid>
                )}
                { tasks.pendingOrdered &&
                    tasks.pendingOrdered.length === 0 && (
                        <>
                            <Grid item xs={12}>
                                <PaperSimpleWrapperText>
                                    Aún no tienes tareas
                                </PaperSimpleWrapperText>
                            </Grid>
                            <Grid item xs={12}>
                                <ButtonBase onClick={handleNewTaskButtonClick}>
                                    Agregar nueva
                                </ButtonBase>
                            </Grid>
                        </>
                ) }
                { !tasks.pendingOrdered && (
                    <p>Skeleton</p>
                ) }
            </Grid>
        </div>
    );
};

TabPaneTaskPending.propTypes = {
    baseApiUrl: PropTypes.string,
    callapi: PropTypes.bool,
    prevStateKey: PropTypes.string
};

TabPaneTaskPending.defaultProps = {
    baseApiUrl: `/api`,
    prevStateKey: `PREV_STATE`
};

export default TabPaneTaskPending;
