import {
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton
} from '@material-ui/core';
import {
    CheckCircle,
    Cancel
} from '@material-ui/icons';
import PropTypes from 'prop-types';

import TypographyBase from '../typography/base';

const DialogResponse = ({
    type,
    open,
    handleClose,
    mapType
}) => (
    <Dialog
        open={open}
        onClose={handleClose}>
        <DialogTitle style={{
            textAlign: 'center',
            backgroundColor: mapType[type] ?
                mapType[type].color :
                `#4BB543`
        }}>
            <IconButton onClick={handleClose}>
                { mapType[type] ?
                    mapType[type].icon :
                    <CheckCircle />
                }
            </IconButton>
        </DialogTitle>
        <DialogContent style={{ textAlign: 'center' }}>
            <TypographyBase variant={'subtitle1'}>
                { mapType[type] ?
                    mapType[type].title :
                    `Bien Hecho`
                }
            </TypographyBase>
            <TypographyBase variant={'body1'}>
                { mapType[type] ?
                    mapType[type].message :
                    `Operación ejecutada correctamente`
                }
            </TypographyBase>
        </DialogContent>
    </Dialog>
);

DialogResponse.propTypes = {
    type: PropTypes.string,
    open: PropTypes.bool,
    handleClose: PropTypes.func,
    mapType: PropTypes.object
};

DialogResponse.defaultProps = {
    mapType: {
        TASK_CREATED: {
            title: `¡Bien hecho!`,
            message: `Tarea creada con éxito`,
            icon: <CheckCircle htmlColor={`white`} fontSize={`large`}/>,
            color: `#4BB543`
        }
    }
};

export default DialogResponse;
