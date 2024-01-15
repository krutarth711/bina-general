import React from 'react';
import { useContext } from 'react';

import { DataContext } from '../../contexts/authContext';
import { Box, CssBaseline, Grid, List, ListItem, ListItemText, Card, CardContent, Typography } from '@mui/material';
import { NavLink } from 'react-router-dom';

// const useStyles = makeStyles((theme) => ({
//   root: {
//     flexGrow: 1,
//     padding: theme.spacing(2),
//   },
//   card: {
//     maxWidth: 300,
//     margin: theme.spacing(2),
//   },
// }));

const Home = () => {
  // const classes = useStyles();

  const tileLinks = [
    { link: "/users", title: "Users", content: "Manage users" },
    { link: "/pending-list", title: "Pending Lists", content: "Upload BL Lists" },
    { link: "/active-list", title: "Active Lists", content: "Manage Active Lists" }
  ];

  const { account } = useContext(DataContext);

  return (
    <div>
      <Box sx={{ display: 'flex', margin: '50px' }}>
        <Grid container spacing={3}>
          {tileLinks.map((item) => (
            <Grid item xs={12} sm={6} md={3} key={item.id}>
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
