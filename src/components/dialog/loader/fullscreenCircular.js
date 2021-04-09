import { forwardRef } from 'react';
import {
    withStyles,
    Dialog,
    Slide,
    DialogContent
} from '@material-ui/core';

import LoaderCircular from '../../loader/circular';

const dialogFullscreenStyles = {
    paperFullScreen: {
        backgroundColor: `transparent`
    }
};

const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

const DialogFullscreenLoading = withStyles(dialogFullscreenStyles)(
    props => (
    <Dialog
        { ...props }
        fullScreen
        TransitionComponent={Transition}/>
    )
);

const dialogContentStyles = {
    root: {
        'display': 'flex',
        'alignItems': 'center',
        'justifyContent': 'center'
    }
};

const DialogContentStyled = withStyles(dialogContentStyles)(DialogContent);

const DialogFullscreenCircularLoader = props => (
    <DialogFullscreenLoading { ...props }>
        <DialogContentStyled>
            <LoaderCircular />
        </DialogContentStyled>
    </DialogFullscreenLoading>
);

export default DialogFullscreenCircularLoader;
