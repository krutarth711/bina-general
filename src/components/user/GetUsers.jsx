import React, { useEffect, useState } from 'react';

import { Box, Typography, Table, TableHead, TableRow, TableBody, Button, Divider, CssBaseline, Dialog, DialogTitle, DialogContent } from '@mui/material';

import { API } from '../../helpers/api';

import { CenterCell, HeaderCenterCell } from './users.style';

import CreateUser from "./CreateUser";

const GetUsers = () => {
    const [users, setUsers] = useState([]);
    const [isCreateUserModalOpen, setCreateUserModalOpen] = useState(false);
    useEffect(() => {
        fetchUsers()
    }, []);

    const fetchUsers = async () => {
        const response = await API.getUsers();
        setUsers(response.data.users || []);
    }

    const openCreateUserModal = () => {
        setCreateUserModalOpen(true);
    };

    const closeCreateUserModal = () => {
        setCreateUserModalOpen(false);
    };

    const removeUser = (removeId) => {
        setUsers(users.filter(user => user.user_id !== removeId));
    };
    return (
        <>
            <Box width='100%' marginLeft='30px'>
                <Box display="flex" alignItems="center" justifyContent="space-between" margin={3}>
                    {/* Left Section */}
                    <Box marginLeft={8}>
                        <Typography variant="h4">Users</Typography>
                    </Box>

                    {/* Right Section */}
                    <Box marginRight={15}>
                        <Button variant="contained" color="primary" onClick={openCreateUserModal}>
                            Create User
                        </Button>
                    </Box>
                </Box>
                <Divider />
                <Table >
                    <TableHead>
                        <TableRow>
                            <HeaderCenterCell>Username</HeaderCenterCell>
                            <HeaderCenterCell>Role</HeaderCenterCell>
                            <HeaderCenterCell>Email</HeaderCenterCell>
                            <HeaderCenterCell>Action</HeaderCenterCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            users.map(user => (
                                <TableRow>
                                    <CenterCell>{user.username}</CenterCell>
                                    <CenterCell>{user.role}</CenterCell>
                                    <CenterCell>{user.email}</CenterCell>
                                    <CenterCell>
                                        <Button variant='contained' color='error' onClick={() => removeUser(user.user_id)}> Remove </Button>
                                    </CenterCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </Box>
            <CreateUser isOpen={isCreateUserModalOpen} onClose={closeCreateUserModal} />
        </>

    );
}

export default GetUsers;
