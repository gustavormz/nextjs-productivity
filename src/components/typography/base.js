import {
	Typography,
	withStyles
} from '@material-ui/core';

const styles = theme => ({
    body1: {
		fontSize: `1rem`,
		[theme.breakpoints.down('sm')]: {
			fontSize: `0.9rem`,
			paddingBottom: `8px`
		},
		padding: 0,
		paddingBottom: `15px`,
		fontFamily: `Century-normal, serif`
	},
	body2: {
		fontSize: `0.9rem`,
		[theme.breakpoints.down('sm')]: {
			fontSize: `0.8rem`,
			paddingBottom: `8px`
		},
		padding: 0,
		paddingBottom: `15px`,
		fontFamily: `Century-normal, serif`
	},
	subtitle1: {
		[theme.breakpoints.down('sm')]: {
			paddingBottom: `8px`
		},
		padding: 0,
		paddingBottom: `15px`,
		fontFamily: `Century, serif`
	},
	caption: {
		[theme.breakpoints.down('sm')]: {
			paddingBottom: `8px`
		},
		padding: 0,
		paddingBottom: `15px`,
		fontFamily: `Century, serif`
	}
});

const TypographyBase = withStyles(styles)(Typography);

export default TypographyBase;
