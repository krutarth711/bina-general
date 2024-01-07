import React from 'react';

import { Divider, Drawer, List, ListItem, ListItemText, ListItemButton } from '@mui/material';
import { NavLink } from 'react-router-dom';

const componentLinks = [
    {
        id: 1,
        link: "/",
        name: "Home"
    },
    {
        id: 2,
        link: "/users",
        name: "Users"
    },
    {
        id: 3,
        link: "/pending-list",
        name: "Pending List"
    }
];

const drawerWidth = 240
const DrawerComp = ({ left, closeDrawer }) => {
    console.log('################################ FIRST:', left, 'function', closeDrawer);
    return (
        <Drawer
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                }
            }}
            PaperProps={{
                sx: {
                    backgroundColor: "#33cccc",
                }
            }}
            anchor="left"
            open={left}
            onClose={closeDrawer}
        >
            <List style={{ marginTop: '50px' }}>
                {componentLinks.map((text, index) => (
                    <ListItem key={text.id} disablePadding>
                        <NavLink to={text.link} style={{ width: '100%', textDecoration: 'none', color: 'black' }}>
                            <ListItemButton style={{ paddingLeft: '15px' }}>
                                <ListItemText primary={text.name} />
                            </ListItemButton>
                        </NavLink>
                    </ListItem>
                ))}
            </List>
            <Divider />
        </Drawer>
    );
}

export default DrawerComp;
