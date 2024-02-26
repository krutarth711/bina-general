import React, { useEffect } from 'react';
import { useContext, useState } from 'react';

import { DataContext } from '../../contexts/authContext';
import { Box, Grid, Card, CardContent, Typography } from '@mui/material';
import { NavLink } from 'react-router-dom';

const Home = () => {
  const { account } = useContext(DataContext);

  const [tileLinks, setTileLinks] = useState([
    { link: "/pending-list", title: "Pending Lists", content: "Upload BL Lists" },
    { link: "/active-list", title: "Active Lists", content: "Manage Active Lists" }
  ]);


  useEffect(() => {
    if (account.role === 'Admin' || account.role === 'Super Admin') {
      setTileLinks([...tileLinks, { link: "/users", title: "Users", content: "Manage users" }]);
    }
  }, []);

  return (
    <div>
      <Box sx={{ display: 'flex', margin: '50px' }}>
        <Grid container spacing={3}>
          {tileLinks.map((item, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <NavLink to={item.link} style={{ textDecoration: 'none' }} >
                <Card >
                  <CardContent>
                    <Typography variant="h6" component="div">
                      {item.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {item.content}
                    </Typography>
                  </CardContent>
                </Card>
              </NavLink>
            </Grid>
          ))}
        </Grid>
      </Box>
    </div>
  );
};

export default Home;
