import PropTypes from 'prop-types';
import {
    VictoryBar,
    VictoryChart,
    VictoryAxis,
    VictoryTheme
} from 'victory';

const ChartBar = ({
    data,
    xKey,
    yKey,
    xTickValues,
    xTickFormat,
    yTickFormat
}) => (
    <VictoryChart
        theme={VictoryTheme.material}
        domainPadding={20}>
        <VictoryAxis
            style={{
                tickLabels: {fontSize: 15, padding: 5}
            }}
            tickValues={xTickValues}
            tickFormat={xTickFormat}/>
        <VictoryAxis
            style={{
                tickLabels: {fontSize: 15, padding: 5}
            }}
            dependentAxis
            tickFormat={yTickFormat}/>
        <VictoryBar
            alignment={'start'}
            barWidth={15}
            data={data}
            x={xKey}
            y={yKey}/>
    </VictoryChart>
);

ChartBar.propTypes = {
    data: PropTypes.array,
    xKey: PropTypes.string,
    yKey: PropTypes.string,
    xTickValues: PropTypes.array,
    xTickFormat: PropTypes.array,
    yTickFormat: PropTypes.func,
    label: PropTypes.string
};

export default ChartBar;
