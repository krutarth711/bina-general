import React, { useState } from 'react';

import { Box, Typography, Table, TableHead, TableRow, TableBody, TableCell, Button } from '@mui/material';

const demoUsers = [{
    user_id: 1,
    name: 'John',
    username: 'John1',
    role: 'Employee',
    email: 'john@example.com'
},
{
    user_id: 2,
    name: 'Alice',
    username: 'Alice2',
    role: 'Admin',
    email: 'alice@example.com'
}];

const GetUsers = () => {
    const [users, setUsers] = useState(demoUsers);

    const removeUser = (removeId) => {
        setUsers(users.filter(user => user.user_id !== removeId));
    };
    return (
        <div>
            <Box>
                <Typography variant='h4'>Users</Typography>
                <Table >
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Username</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            users.map(user => (
                                <TableRow>
                                    <TableCell>{user.name}</TableCell>
                                    <TableCell>{user.username}</TableCell>
                                    <TableCell>{user.role}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        <Button variant='contained' color='error' onClick={() => removeUser(user.user_id)}> Remove </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </Box>


        </div>
    );
}

export default GetUsers;
