import {
	Container,
	withStyles
} from '@material-ui/core';

const styles = {
	root: {
		paddingTop: `15px`,
		paddingBottom: `15px`,
		minHeight: `90vh`
	}
};

const ContainerStyled = withStyles(styles)(Container);

const ContainerBase = ({
	children,
	maxWidth
}) => (
	<main>
		<ContainerStyled maxWidth={maxWidth}>
			{ children }
		</ContainerStyled>
	</main>
);

export default ContainerBase;
