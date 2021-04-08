import {
	Typography,
	withStyles
} from '@material-ui/core';
import PropTypes from 'prop-types';

const styles = theme => ({
	h1: {
		fontSize: `1.4rem`,
		[theme.breakpoints.down('sm')]: {
			fontSize: `1.2rem`,
			paddingBottom: `10px`
		},
		padding: 0,
		paddingBottom: `15px`
	}
});

const TypographyStyled = withStyles(styles)(Typography);

const TypographyTitle = withStyles(styles)(({
	children,
	style
}) => (
	<TypographyStyled style={{ ...style }} variant={'h1'}>
		{ children }
	</TypographyStyled>
));

TypographyTitle.propTypes = {
	style: PropTypes.object
};

export default TypographyTitle;
