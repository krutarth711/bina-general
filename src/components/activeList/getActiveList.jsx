import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { List, ListSubheader, ListItemButton, Table, TableHead, TableBody, TableCell, TableRow, Button, Typography, ListItemIcon, ListItemText, Collapse, Box } from '@mui/material';
import { ExpandMore, ExpandLess, StarBorder } from '@mui/icons-material';
import CreateActiveList from './createActiveList';

import { CenterCell, HeaderCenterCell } from './activeList.styles';
import { API } from '../../helpers/api';

const tempActiveBlist = [
    {
        name: 'something 1',
        BL_id: 1,
    },
    {
        name: 'something 2',
        BL_id: 2,
    },
];

const tempActiveLists = [[
    {
        item1: 'something',
        item2: 'something2'
    },
    {
        item1: 'something3',
        item2: 'something4'
    }
],
[
    {
        item1: 'nothing',
        item2: 'nothing2'
    },
    {
        item1: 'nothing3',
        item2: 'nothing4'
    }
]
];

const GetActiveList = () => {
    const location = useLocation();
    const [isCreateUserModalOpen, setCreateUserModalOpen] = useState(false);
    const [createActiveListData, setCreateActiveListData] = useState({
        plist_id: '',
        BL_id: '',
        list_status: '',
        listname: '',
        s3_url: '',
        submit_url: ''
    });
    const [activeBLists, setActiveBLists] = useState([]);
    // const [open, setOpen] = useState(false);

    const [openStates, setOpenStates] = useState(Array(activeBLists.length).fill(false));

    const handleListClick = (index) => {
        const newOpenStates = [...openStates];
        newOpenStates[index] = !newOpenStates[index];
        setOpenStates(newOpenStates);
    };

    useEffect(() => {
        const fetchData = async () => {
            if (location?.state) {
                console.log('location. state:: ', location?.state);
                setCreateActiveListData((prevData) => {
                    console.log('initial data coming as location.state: ', location.state);
                    console.log('previous data is: ', prevData);
                    return location?.state;
                });
                console.log('location. state after assigning:: ', createActiveListData);
                setCreateUserModalOpen(true);
            }
            await getActiveLists();
        };
        fetchData();
    }, [location?.state])

    const getActiveLists = async () => {
        //api call to getActiveList
        const activeListsData = await API.getActivePendingLists({ status: 'In-Progress' });
        console.log('activeListsData:', activeListsData);
        setActiveBLists(activeListsData.data.plists);
        // console.log('activeBLists:: ', activeBLists);
    }

    const moveToReview = () => {
        console.log('will be moved to review');
    };

    const removeItem = () => {
        console.log('will be removed');
    }

    const editItem = () => {
        console.log('will be edited');
    }

    const addItemClick = (index, activeBlist) => {
        // setCreateActiveListData((prevData) => ({ ...prevData, ...activeBlist }));
        // console.log(' AFTER SETTING create active list:  ', createActiveListData);
        setCreateUserModalOpen(true);
    }

    const closeCreateUserModal = () => {
        setCreateUserModalOpen(false);
        getActiveLists();
    };
    return (
        <div>
            {/* THE ACTIVE LIST IS BEING DISPLAYED RIGHT NOW. BE GRATEFUL.! */}
            <Box maxWidth='100%' margin='30px'>
                <Box display="flex" alignItems="center" justifyContent="space-between" margin={3}>
                    {/* Left Section */}
                    <Box marginLeft={8}>
                        <Typography variant="h4">Active Lists</Typography>
                    </Box>
                </Box>
                {
                    activeBLists.map((activeBlist, index) => (
                        <List
                            sx={{ width: '100%', maxWidth: '100%', bgcolor: 'background.paper' }}
                            component="nav"
                            aria-labelledby="nested-list-subheader"
                        >
                            <ListItemButton onClick={() => handleListClick(index)}>
                                <ListItemIcon>
                                </ListItemIcon>
                                <ListItemText primary={activeBlist.listname} />
                                {activeBlist.open ? <ExpandLess /> : <ExpandMore />}
                            </ListItemButton>
                            <Collapse in={openStates[index]} timeout="auto" unmountOnExit>
                                <Box display="flex" alignItems="center" justifyContent="space-between" margin={3}>
                                    {/* Left Section */}
                                    <Box marginLeft={8}>
                                        <Typography variant="h6">Item List</Typography>
                                    </Box>

                                    {/* Right Section */}
                                    <Box marginRight={10}>
                                        <Button onClick={() => addItemClick(index, activeBlist)} variant='contained' color='success'>
                                            Add Item</Button>
                                        <Button onClick={() => moveToReview(index)} variant='contained' color='primary' style={{ marginLeft: '10px' }}>
                                            Move to Review</Button>
                                    </Box>
                                </Box>
                                <Table >
                                    <TableHead>
                                        <TableRow>
                                        </TableRow>
                                        <TableRow>
                                            <HeaderCenterCell>Username</HeaderCenterCell>
                                            <HeaderCenterCell>Role</HeaderCenterCell>
                                            <HeaderCenterCell>Action</HeaderCenterCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            tempActiveLists[index].map(user => (
                                                <TableRow>
                                                    <CenterCell>{user.item1}</CenterCell>
                                                    <CenterCell>{user.item2}</CenterCell>
                                                    <CenterCell>
                                                        <Button variant='contained' color='error' onClick={() => editItem(index)} > Edit </Button>
                                                        <Button variant='contained' color='error' onClick={() => removeItem(index)} > Remove </Button>
                                                    </CenterCell>
                                                </TableRow>
                                            ))
                                        }
                                    </TableBody>
                                </Table>
                            </Collapse>
                        </List>
                    ))
                }

                <CreateActiveList isOpen={isCreateUserModalOpen} onClose={closeCreateUserModal} initData={createActiveListData} />
            </Box>
        </div >
    );
}

export default GetActiveList;
