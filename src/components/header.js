import {
    useState
} from 'react';
import {
    Grid,
    Hidden,
    IconButton
} from '@material-ui/core';
import {
    Menu
} from '@material-ui/icons';

import AppBarBase from './appBar/base';
import DrawerBase from './drawer/base';
import Logo from './icon/logo';
import TypographyBase from './typography/base';

const Header = ({
    handleTabChange,
    tabActive
}) => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const toggleDrawer = open => event => {
        if (event.type === `keydown` && (event.key === `Tab` || event.key === `Shift`)) {
            return;
        }
        setIsDrawerOpen(open);
    };

    return (
        <AppBarBase>
            <Grid container spacing={1}>
                <Grid
                    alignItems={'center'}
                    container
                    item xs={4}>
                    <IconButton
                        style={{
                            color: `white`
                        }}
                        onClick={toggleDrawer(true)}>
                        <Menu />
                    </IconButton>
                </Grid>
                <Hidden mdDown>
                    <Grid
                        alignItems={'center'}
                        container
                        justify={`center`}
                        item
                        xs={4}>
                        <Logo
                            height={60}
                            width={60}/>
                    </Grid>
                    <Grid
                        container
                        justify={`flex-end`}
                        alignItems={`center`}
                        item xs={4}>
                        <TypographyBase style={{
                            margin: 0,
                            padding: 0
                        }}>
                            Bienvenido
                        </TypographyBase>
                    </Grid>
                </Hidden>
                <Hidden mdUp>
                    <Grid
                        alignItems={'center'}
                        container
                        justify={`flex-end`}
                        item
                        xs={8}>
                        <Logo
                            height={60}
                            width={60}/>
                    </Grid>
                </Hidden>
            </Grid>
            <DrawerBase
                handleTabChange={handleTabChange}
                tabActive={tabActive}
                open={isDrawerOpen}
                onClose={toggleDrawer(false)}
                onOpen={toggleDrawer(true)} />
        </AppBarBase>
    );
};

export default Header;
