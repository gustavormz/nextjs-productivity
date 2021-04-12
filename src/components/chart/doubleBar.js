import PropTypes from 'prop-types';
import {
    VictoryBar,
    VictoryChart,
    VictoryAxis,
    VictoryTheme,
    VictoryGroup,
    VictoryStack
} from 'victory';

const ChartBarDouble = ({
    dataFirstSet,
    dataSecondSet,
    xKeyFirst,
    yKeyFirst,
    xKeySecond,
    yKeySecond,
    xTickValues,
    xTickFormat,
    yTickFormat
}) => (
    <VictoryChart
        theme={VictoryTheme.material}
        domainPadding={20}>
        <VictoryGroup
            offset={20}
            style={{ data: { width: 15} }}>
            <VictoryStack colorScale={"red"}>
                { dataFirstSet.map((data, index) => (
                    <VictoryBar
                        key={index}
                        data={data}/>
                )) }
            </VictoryStack>
            <VictoryStack colorScale={"green"}>
                { dataSecondSet.map((data, index) => (
                    <VictoryBar
                        key={index}
                        data={data}/>
                )) }
            </VictoryStack>
        </VictoryGroup>
    </VictoryChart>
);

ChartBarDouble.propTypes = {
    data: PropTypes.array,
    xKey: PropTypes.string,
    yKey: PropTypes.string,
    xTickValues: PropTypes.array,
    xTickFormat: PropTypes.array,
    yTickFormat: PropTypes.func,
    label: PropTypes.string
};

export default ChartBarDouble;
