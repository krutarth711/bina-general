import { AppBar, IconButton, Toolbar, Box, Button, Typography, Menu, MenuItem, Tooltip, Avatar } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import React, { useContext, useEffect, useState } from 'react';
import DrawerComp from '../drawer/Drawer';
import { DataContext } from '../../contexts/authContext';

const Navbar = () => {
    const { account } = useContext(DataContext);
    const [left, setLeft] = useState(false);
    const [anchorElUser, setAnchorElUser] = useState('false');
    const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

    const handleOpenUserMenu = () => {
        setAnchorElUser(true);
    }

    const openDrawerHandler = () => {
        setLeft(true);
    };

    const closeDrawer = () => {
        setLeft(false);
    }

    const handleCloseUserMenu = () => {

    }

    return (
        <>
            {account.username ?
                <>
                    <Box sx={{ flexGrow: 1 }}>
                        <AppBar position="static" style={{ backgroundColor: '#33cccc' }}>
                            <Toolbar>
                                <IconButton
                                    edge="start"
                                    style={{ marginRight: 2 }}
                                    color="inherit"
                                    aria-label="open drawer"
                                    onClick={openDrawerHandler}
                                >
                                    <MenuIcon />
                                </IconButton>
                                <Typography
                                    variant="h6"
                                    noWrap
                                    component="div"
                                    sx={{ flexGrow: 1 }}
                                ></Typography>
                            </Toolbar>
                        </AppBar>
                        <DrawerComp left={left} closeDrawer={closeDrawer} />
                    </Box>
                </> : <></>
            }
        </>
    );
}

export default Navbar;
