import PropTypes from 'prop-types';

import SelectBase from '../base';

const SelectTaskDefaultDuration = props => (
    <SelectBase
        {...props}
        labelWidth={62}
        inputProps={{
            name: 'duration'
        }}
        title={`Duración`} />
);

SelectTaskDefaultDuration.propTypes = {
    options: PropTypes.array
};

SelectTaskDefaultDuration.defaultProps = {
    options: [
        {
            label: `Todas`,
            value: `ALL`
        },
        {
            label: `Corto`,
            value: `SHORT`
        },
        {
            label: `Medio`,
            value: `MEDIUM`
        },
        {
            label: `Largo`,
            value: `LONG`
        }
    ]
};

export default SelectTaskDefaultDuration;
