import { AppBar, IconButton, Toolbar, Box, ListItemIcon, Typography, Menu, MenuItem, Tooltip, Avatar } from '@mui/material';
import { Menu as MenuIcon, Logout as LogoutIcon } from '@mui/icons-material';
import React, { useContext, useState } from 'react';
import DrawerComp from '../drawer/Drawer';
import { DataContext } from '../../contexts/authContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const { account, setAccount } = useContext(DataContext);
    const [left, setLeft] = useState(false);
    const [anchorElUser, setAnchorElUser] = useState(false);
    const navigate = useNavigate();

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    }

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const openDrawerHandler = () => {
        setLeft(true);
    };

    const closeDrawer = () => {
        setLeft(false);
    }

    const handleLogout = () => {
        sessionStorage.clear();
        setAccount({ username: '', roel: '' })
        navigate('/login');
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
                                <Tooltip title="Account settings">
                                    <IconButton
                                        onClick={handleOpenUserMenu}
                                        size="small"
                                        sx={{ ml: 2 }}
                                        aria-controls={anchorElUser ? 'account-menu' : undefined}
                                        aria-haspopup="true"
                                        aria-expanded={anchorElUser ? 'true' : undefined}
                                    >
                                        <Avatar sx={{ width: 32, height: 32 }} alt={account.username}></Avatar>
                                    </IconButton>
                                </Tooltip>
                                <Menu
                                    anchorEl={anchorElUser}
                                    id="account-menu"
                                    open={anchorElUser}
                                    onClose={handleCloseUserMenu}
                                    onClick={handleCloseUserMenu}
                                    PaperProps={{
                                        elevation: 0,
                                        sx: {
                                            overflow: 'visible',
                                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                            mt: 1.5,
                                            '& .MuiAvatar-root': {
                                                width: 32,
                                                height: 32,
                                                ml: -0.5,
                                                mr: 1,
                                            },
                                            '&::before': {
                                                content: '""',
                                                display: 'block',
                                                position: 'absolute',
                                                top: 0,
                                                right: 14,
                                                width: 10,
                                                height: 10,
                                                bgcolor: 'background.paper',
                                                transform: 'translateY(-50%) rotate(45deg)',
                                                zIndex: 0,
                                            },
                                        },
                                    }}
                                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                                >
                                    <MenuItem onClick={handleLogout}>
                                        <ListItemIcon>
                                            <LogoutIcon fontSize="small" />
                                        </ListItemIcon>
                                        Logout
                                    </MenuItem>
                                </Menu>
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
