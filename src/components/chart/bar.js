import PropTypes from 'prop-types';
import {
    VictoryBar,
    VictoryChart,
    VictoryAxis,
    VictoryTheme,
    VictoryLabel
} from 'victory';

const ChartBar = ({
    data,
    xKey,
    yKey,
    xTickValues,
    xTickFormat,
    yTickFormat,
    yTickValues
}) => (
    <VictoryChart
        padding={{
            left: 55,
            right: 5,
            top: 5,
            bottom: 50
        }}
        style={{
            fontSize: 10
        }}
        theme={VictoryTheme.material}
        domainPadding={20}>
        <VictoryAxis
            tickLabelComponent={<VictoryLabel angle={-45}/>}
            style={{
                tickLabels: {
                    fontSize: 11
                }
            }}
            tickValues={xTickValues}
            tickFormat={xTickFormat}/>
        <VictoryAxis
            
            style={{
                tickLabels: {
                    fontSize: 11
                }
            }}
            dependentAxis
            tickValues={yTickValues}
            tickFormat={yTickFormat}/>
        <VictoryBar
            horizontal
            barRatio={0.8}
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
