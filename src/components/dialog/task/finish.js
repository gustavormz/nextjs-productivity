import PropTypes from 'prop-types';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Grid
} from '@material-ui/core';

import ButtonBase from '../../ui/button/base';
import ButtonSecondary from '../../ui/button/secondary';
import DividerBase from '../../divider/base';
import TypographyBase from '../../typography/base';

const DialogTaskFinsh = ({
    open,
    handleClose,
    id,
    handleConfirm,
    title
}) => (
    <Dialog
        open={open}
        onClose={handleClose}>
        <DialogTitle onClose={handleClose}>
            Confirmar
        </DialogTitle>
        <DialogContent>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TypographyBase
                        style={{ textAlign: `center` }}>
                        ¿Estás seguro que deseas finalizar la tarea {title}?
                    </TypographyBase>
                </Grid>
                <Grid item xs={12}>
                    <DividerBase />
                </Grid>
                <Grid item xs={4}/>
                <Grid item xs={4}>
                    <ButtonBase
                        onClick={handleConfirm}>
                        Confirmar
                    </ButtonBase>
                </Grid>
                <Grid item xs={4}>
                    <ButtonSecondary onClick={handleClose}>
                        Cancelar
                    </ButtonSecondary>
                </Grid>
            </Grid>
        </DialogContent>
    </Dialog>
);

DialogTaskFinsh.propTypes = {
    open: PropTypes.bool,
    handleClose: PropTypes.func,
    id: PropTypes.number,
    handleConfirm: PropTypes.func,
    title: PropTypes.string
};

export default DialogTaskFinsh;
