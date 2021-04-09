import PropTypes from 'prop-types';

import SelectBase from '../base';

const SelectTaskDuration = props => (
    <SelectBase
        {...props}
        labelWidth={62}
        inputProps={{
            name: 'duration'
        }}
        title={`Duración`} />
);

SelectTaskDuration.propTypes = {
    options: PropTypes.array
};

SelectTaskDuration.defaultProps = {
    options: []
};

export default SelectTaskDuration;
