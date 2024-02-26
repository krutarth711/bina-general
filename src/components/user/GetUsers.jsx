import React, { useContext, useEffect, useState } from 'react';

import { Box, Typography, Table, TableHead, TableRow, TableBody, Button, Divider, Backdrop, CircularProgress } from '@mui/material';

import { API } from '../../helpers/api';

import { CenterCell, HeaderCenterCell } from './users.style';

import CreateUser from "./CreateUser";
import { DataContext } from "../../contexts/authContext";


const GetUsers = () => {
    const { account } = useContext(DataContext);
    const [users, setUsers] = useState([]);
    const [openLoader, setOpenLoader] = useState(false);
    const [isCreateUserModalOpen, setCreateUserModalOpen] = useState(false);
    useEffect(() => {
        fetchUsers()
    }, []);

    const fetchUsers = async () => {
        setOpenLoader(true);
        const response = await API.getUsers();
        setUsers(response.data.users || []);
        setOpenLoader(false);
    }

    const openCreateUserModal = () => {
        setCreateUserModalOpen(true);
    };

    const closeCreateUserModal = () => {
        setCreateUserModalOpen(false);
    };

    const removeUser = async (removeId) => {
        try {
            setOpenLoader(true);
            await API.deleteUser({ user_id: removeId });
            fetchUsers()
            setOpenLoader(false);
        } catch (error) {
            console.log('ERROR deleting user: ', error);
            alert('Error deleting user');
        }
        // alert('This feature will soon be available');
        // setUsers(users.filter(user => user.user_id !== removeId));
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
                        <Button variant="contained" color="primary" onClick={openCreateUserModal} disabled={account.role !== "Super Admin"}>
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
                                        <Button variant='contained' color='error' onClick={() => removeUser(user.user_id)} disabled={account.role !== "Super Admin"}> Remove </Button>
                                    </CenterCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </Box>
            <CreateUser isOpen={isCreateUserModalOpen} onClose={closeCreateUserModal} />
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={openLoader}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </>

    );
}

export default GetUsers;
