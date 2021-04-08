import Header from '../header';
import Footer from '../footer';
import ContainerBase from '../container/base';

const LayoutBase = ({
    maxWidth,
    children
}) => (
    <>
        <Header />
        <ContainerBase maxWidth={maxWidth}>
            { children }
        </ContainerBase>
        <Footer />
    </>
);

LayoutBase.defaultProps = {
    maxWidth: `lg`
};

export default LayoutBase;
