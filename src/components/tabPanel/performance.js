import PropTypes from 'prop-types';
import {
    useEffect,
    useState
} from 'react';
import {
    Grid
} from '@material-ui/core';
import moment from 'moment';

import TypographyTitle from '../typography/title';
import DatePickerBase from '../ui/datePicker/base';
import DialogLoaderFullscreenCircular from '../dialog/loader/fullscreenCircular';
import BarChart from '../chart/bar';
import TypographyBase from '../typography/base';
import DividerBase from '../divider/base';
import PaperSimpleWrapperText from '../paper/simpleWrapperText';
import BarChartDouble from '../chart/doubleBar';

const getFormatDate = date => moment(date).format('YYYY/MM/DD');

const barChartYAxisTickFormat = value => value;

const getXTickValues = tasks => tasks.map(task => task.dayOfWeek);

const getXTicKFormat = (tasks, mapValueFormat) => tasks.map(task => mapValueFormat[task.dayOfWeek]);

const getRelationSpentTimeRelatedWithAllAvailableTime = tasks => {
    const relationArray = [];
    for (let task of tasks) {
        const spentTimePercentage = Math.round(100 / task.totalPosibleTimeSeconds * task.totalSpentTime);
        relationArray.push ({
            spentTimePercentage,
            fullTime: 100,
            ...task
        });
    }
    return relationArray;
};

const TabPanePerformance = ({
    baseApiUrl,
    mapDayWeekDay,
    ...props
}) => {
    const [state, setState] = useState({
        isRequesting: true,
        tasks: undefined,
        barChart: {
            xTickFormat: [],
            xTickValues: [],
            label: ``
        }
    });
    const [intialDate, setInitialDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    useEffect(function () {
        async function fetchData () {
            setState({
                ...state,
                isRequesting: true
            });
            const query = `?dayStart=${getFormatDate(intialDate)}&dayEnd=${getFormatDate(endDate)}&type=BAR_DAY_TASK`;
            const tasks = await  (await fetch (`${baseApiUrl}/performance${query}`)).json();

            const barChart = {
                xTickFormat: getXTicKFormat(tasks.data, mapDayWeekDay),
                xTickValues: getXTickValues(tasks.data)
            };

            setState({
                ...state,
                isRequesting: false,
                tasks: tasks.data,
                barChart
            });
        }
        fetchData();
    }, [intialDate, endDate]);

    function handleDatePickerInitial (value) {
        setInitialDate(value);
    }

    function handleDatePickerEnd (value) {
        setEndDate(value)
    }

    return (
        <div
            style={{
                width: `100%`,
                padding: 20
            }}
            {...props}>
            <DialogLoaderFullscreenCircular open={state.isRequesting}/>
            <Grid
                container
                spacing={4}>
                <Grid item xs={12}/>
                <Grid item xs={12}>
                    <TypographyTitle
                        style={{
                            fontWeight: `bold`,
                            margin: 0
                        }}>
                        Rendimiento
                    </TypographyTitle>
                </Grid>
                <Grid
                    container
                    spacing={2}
                    item xs={12}>
                    <Grid
                        item
                        xs={12}
                        sm={6}>
                        <DatePickerBase
                            maxDate={endDate}
                            label={`Fecha inicio`}
                            value={intialDate}
                            placeholder="10/10/2018"
                            onChange={handleDatePickerInitial}/>
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        sm={6}>
                        <DatePickerBase
                            minDate={intialDate}
                            label={`Fecha final`}
                            value={endDate}
                            placeholder="10/10/2018"
                            onChange={handleDatePickerEnd}
                            maxDate={new Date()}/>
                    </Grid>
                    <Grid item xs={12}>
                        <DividerBase />
                    </Grid>
                    <Grid item xs={12}>
                        <TypographyBase
                            style={{
                                fontWeight: `bold`,
                                margin: 0,
                                textAlign: `center`
                            }}>
                            Tareas completadas por día
                        </TypographyBase>
                        { state.tasks && state.tasks.length > 0 ? (
                            <BarChart
                                xTickValues={state.barChart.xTickValues}
                                xKey={`dateFormated`}
                                yKey={`value`}
                                data={state.tasks}/>
                        ) : (
                            <PaperSimpleWrapperText>
                                <TypographyBase style={{ margin: 0, padding: 0 }}>
                                    No tienes información para mostrar
                                </TypographyBase>
                            </PaperSimpleWrapperText>
                        ) }
                    </Grid>
                </Grid>
                <Grid
                    container
                    spacing={2}
                    item xs={12}>
                    <Grid item xs={12}>
                        <DividerBase />
                    </Grid>
                    <Grid item xs={12}>
                        <TypographyBase
                            style={{
                                fontWeight: `bold`,
                                margin: 0,
                                textAlign: `center`
                            }}> 
                            Porcentaje de tiempo empleado para resolver las tareas de un día
                        </TypographyBase>
                        { state.tasks && state.tasks.length > 0 ? (
                            <BarChart
                                yTickFormat={value => `${value}%`}
                                yTickValues={[0, 20, 40, 60, 80, 100]}
                                xTickValues={state.barChart.xTickValues}
                                xKey={`dateFormated`}
                                yKey={`spentTimePercentage`}
                                data={getRelationSpentTimeRelatedWithAllAvailableTime(state.tasks)}/>
                        ) : (
                            <PaperSimpleWrapperText>
                                <TypographyBase style={{ margin: 0, padding: 0 }}>
                                    No tienes información para mostrar
                                </TypographyBase>
                            </PaperSimpleWrapperText>
                        ) }
                    </Grid>
                </Grid>
            </Grid>
        </div>
    );
};

TabPanePerformance.propTypes = {
    baseApiUrl: PropTypes.string,
    mapDayWeekDay: PropTypes.array
};

TabPanePerformance.defaultProps = {
    baseApiUrl: `/api`,
    mapDayWeekDay: [
        'Dom',
        'Lun',
        'Mar',
        'Mie',
        'Jue',
        'Vie',
        'Sab'
    ]
};

export default TabPanePerformance;
