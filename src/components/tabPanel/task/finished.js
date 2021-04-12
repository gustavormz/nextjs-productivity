import {
    useEffect,
    useState
} from 'react';
import PropTypes from 'prop-types';
import {
    Grid,
    List
} from '@material-ui/core';

import ListItemTask from '../../list/item/task';
import PaperSimpleWrapperText from '../../paper/simpleWrapperText';
import ButtonBase from '../../ui/button/base';
import TypographyBase from '../../typography/base';

const getDataFromDynamoResponse = dynamoResponse => dynamoResponse.error ?
    [] :
    dynamoResponse.data;

const TabPaneTaskFinished = ({
    baseApiUrl,
    callapi,
    ...props
}) => {
    const [state, setState] = useState({
        isRequesting: false,
        durations: [],
        tasks: undefined
    });

    // get all finished tasks
    useEffect(function () {
        async function fetchData () {
            setState({
                ...state,
                isRequesting: true
            });
            const responses = await Promise.all([
                await fetch (`${baseApiUrl}/task?status=FINISHED`),
                await fetch (`${baseApiUrl}/duration`)
            ]);
            const tasks = getDataFromDynamoResponse(await responses[0].json());
            const durations = getDataFromDynamoResponse(await responses[1].json());

            setState({
                ...state,
                tasks,
                durations,
                isRequesting: false
            });
        }
        fetchData();
    }, [callapi]);

    return (
        <div
            style={{
                width: `100%`,
                padding: 10
            }}
            { ...props }>
            <Grid
                container
                spacing={2}>
                {( state.tasks &&
                    state.tasks.length > 0) &&
                    (
                        <Grid
                            item
                            xs={12}>
                            <List>
                                { state.tasks.map(task => (
                                    <ListItemTask
                                        key={task.timestamp.toString()}
                                        task={task}/>
                                )) }
                            </List>
                        </Grid>
                    )
                }
                { state.tasks &&
                    state.tasks.length === 0 && (
                        <>
                            <Grid item xs={12}>
                                <PaperSimpleWrapperText>
                                    Aún no has completado tareas
                                </PaperSimpleWrapperText>
                            </Grid>
                            <Grid item xs={12}>
                                <ButtonBase>
                                    Ir a tareas pendientes
                                </ButtonBase>
                            </Grid>
                        </>
                ) }
                { !state.tasks && (
                    <PaperSimpleWrapperText>
                        <TypographyBase>
                            No tienes tareas para mostrar
                        </TypographyBase>
                    </PaperSimpleWrapperText>
                ) }
            </Grid>
        </div>
    );
};

TabPaneTaskFinished.propTypes = {
    baseApiUrl: PropTypes.string,
    callapi: PropTypes.bool
};

TabPaneTaskFinished.defaultProps = {
    baseApiUrl: `/api`
};

export default TabPaneTaskFinished;
