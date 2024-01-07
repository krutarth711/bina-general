import React from 'react';
import { useContext } from 'react';

import { DataContext } from '../../contexts/authContext';
import { Box, CssBaseline, List, ListItem, ListItemText } from '@mui/material';
import { NavLink } from 'react-router-dom';


const Home = () => {

  const { account } = useContext(DataContext);

  return (
    <div>
      <Box sx={{ display: 'flex' }}>
        <List>
          <ListItem>
            <NavLink to="/users" >
              <ListItemText primary="Users" />
            </NavLink>
          </ListItem>
          <ListItem>
            <NavLink to="/pending-list" >
              <ListItemText primary="pending-list" />
            </NavLink>
          </ListItem>
        </List>
      </Box>
    </div>
  );
};

export default Home;
