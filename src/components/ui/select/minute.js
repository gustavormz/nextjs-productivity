import PropTypes from 'prop-types';

import SelectBase from '../base';

const SelectMinute = props => (
    <SelectBase
        {...props}
        labelWidth={45}
        inputProps={{
            name: 'status'
        }}
        title={`Estado`} />
);

SelectMinute.propTypes = {
    options: PropTypes.array
};

SelectMinute.defaultProps = {
    options: [
        {
            value: 0,
            label: `Pendiente`
        }, {
            value: `FINISHED`,
            label: `Terminada`
        }
    ]
};

export default SelectMinute;
