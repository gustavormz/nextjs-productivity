import {
    useState
} from 'react';
import {
    Grid,
    IconButton
} from '@material-ui/core';
import {
    Menu
} from '@material-ui/icons';

import AppBarBase from './appBar/base';
import DrawerBase from './drawer/base';

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
                <Grid item xs={4}>
                    <IconButton onClick={toggleDrawer(true)}>
                        <Menu />
                    </IconButton>
                </Grid>
                <Grid item xs={4}>
    
                </Grid>
                <Grid item xs={4}>
    
                </Grid>
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
