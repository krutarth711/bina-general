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
                        <AppBar position="static">
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
                                {/* <Box sx={{ flexGrow: 0 }}>
                                    <Tooltip title="Open settings">
                                        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                            <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
                                        </IconButton>
                                    </Tooltip>
                                    <Menu
                                        sx={{ mt: '45px' }}
                                        id="menu-appbar"
                                        anchorEl={anchorElUser}
                                        anchorOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                        }}
                                        keepMounted
                                        transformOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                        }}
                                        open={Boolean(anchorElUser)}
                                        onClose={handleCloseUserMenu}
                                    >
                                        {settings.map((setting) => (
                                            <MenuItem key={setting} onClick={handleCloseUserMenu}>
                                                <Typography textAlign="center">{setting}</Typography>
                                            </MenuItem>
                                        ))}
                                    </Menu>
                                </Box> */}
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
