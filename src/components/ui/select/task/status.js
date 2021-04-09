import PropTypes from 'prop-types';

import SelectBase from '../base';

const SelectTaskStatus = props => (
    <SelectBase
        {...props}
        labelWidth={50}
        inputProps={{
            name: 'status'
        }}
        title={`Estado`} />
);

SelectTaskStatus.propTypes = {
    options: PropTypes.array
};

SelectTaskStatus.defaultProps = {
    options: [
        {
            value: `PENDING`,
            label: `Pendiente`
        }, {
            value: `FINISHED`,
            label: `Terminada`
        }
    ]
};

export default SelectTaskStatus;
