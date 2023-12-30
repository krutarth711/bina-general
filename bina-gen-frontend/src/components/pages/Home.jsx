import React from 'react';
import { useContext } from 'react';

import { DataContext } from '../../contexts/authContext';
import GetUsers from '../user/GetUsers';

const Home = () => {

  const { account } = useContext(DataContext);

  return (
    <div>
      <h2>Welcome to the Dashboard {account.username}.! You are a {account.role}</h2>
      {account.role === 'Super Admin' ?
        <GetUsers /> : ''
      }
      {/* Display content for the home page */}
    </div>
  );
};

export default Home;
