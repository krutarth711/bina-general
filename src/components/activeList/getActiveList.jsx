import React, { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { List, ListSubheader, ListItemButton, Tooltip, Table, TableHead, TableBody, TableCell, TableRow, Button, Typography, ListItemIcon, ListItemText, Collapse, Box } from '@mui/material';
import { ExpandMore, ExpandLess, StarBorder } from '@mui/icons-material';
import CreateActiveList from './createActiveList';
import { DataContext } from '../../contexts/authContext';

import { CenterCell, HeaderCenterCell } from './activeList.styles';
import { API } from '../../helpers/api';

const GetActiveList = () => {
    const location = useLocation();
    const [isCreateUserModalOpen, setCreateUserModalOpen] = useState(false);
    const [createActiveListData, setCreateActiveListData] = useState({
        BL_id: "",
        list_status: "",
        listname: "",
        alist_id: null,
        quantity: 0,
        total_weight: 0,
        unit: "KGS",
        total_price: 0,
        item_name: "",
        unit_price: 0,
        unit_weight: 0
    });

    // const { account } = useContext(DataContext);

    const [activeBLists, setActiveBLists] = useState([]);
    const [activeListItems, setActiveListItems] = useState([]);

    const [openStates, setOpenStates] = useState(Array(activeBLists.length).fill(false));

    const handleListClick = async (index) => {
        console.log('activeBLists:: ', activeBLists);
        console.log('activeBLists[index]:: ', activeBLists[index]);
        setActiveListItems([]);

        // Close all other list items
        const newOpenStates = closeList();

        // Open or close the clicked list item
        newOpenStates[index] = !openStates[index];
        setOpenStates(newOpenStates);

        // Fetch active items only if the list item is opened
        if (newOpenStates[index]) {
            console.log('OPENED ITEM: ', activeBLists);
            await getActiveItems(activeBLists[index].plist_id);
        }
    };

    useEffect(() => {
        console.log('location. state after assigning:: ', createActiveListData);
        if (createActiveListData.BL_id) {
            setCreateUserModalOpen(true);
        }
    }, [createActiveListData])

    useEffect(() => {
        const fetchData = async () => {
            if (location?.state) {
                console.log('location. state:: ', location.state);
                setCreateActiveListData((prevData) => ({ ...prevData, ...location.state }));
            }
            await getActiveLists();
        };
        fetchData();
    }, [])

    const getActiveLists = async () => {
        const activeListsData = await API.getActivePendingLists({ status: true });
        console.log('activeListsData:', activeListsData);
        setActiveBLists(activeListsData?.data?.plists || []);
    }

    const getActiveItems = async (BL_id) => {
        console.log('passing BL_id:: ', BL_id);
        const activeListItemsData = await API.getActiveListItems({ BL_id });
        console.log('activeListItemsData:', activeListItemsData);
        if (activeListItemsData?.data?.alists) {
            setActiveListItems(activeListItemsData.data.alists);
        }
    }

    const moveToReview = async (activeBlist) => {
        console.log('will be moved to review');
        try {
            await API.updatePendingList({ plist_id: activeBlist.plist_id, status: 'In-Review' });
            getActiveLists();
            closeList();
        } catch (error) {
            alert('error occured while moving the item to review');
            console.log('error', error);
        }
    };

    const removeItem = () => {
        console.log('will be removed');
    }

    const editItem = (activeItem) => {
        console.log('will be edited: ', activeItem);
        setCreateActiveListData((prevData) => ({ ...prevData, ...activeItem }));
    }

    const addItemClick = (activeBlist) => {
        console.log('ACTIVE BLIST: ', activeBlist);
        setCreateActiveListData({
            BL_id: activeBlist.plist_id,
            list_status: activeBlist.list_status,
            listname: activeBlist.listname,
            alist_id: null,
            quantity: 0,
            total_weight: 0,
            unit: "KGS",
            total_price: 0,
            item_name: "",
            unit_price: 0,
            unit_weight: 0
        });
        setCreateUserModalOpen(true);
    }

    const submitList = () => {
        alert('list shall be submitted');
        // list submitted logic
    }

    const closeList = () => {
        const newOpenStates = Array(activeBLists.length).fill(false);
        setOpenStates(newOpenStates);
        return newOpenStates;
    }

    const moveBackInProgress = async (activeBlist) => {
        try {
            await API.updatePendingList({ plist_id: activeBlist.plist_id, status: 'In-Progress' });
            getActiveLists();
            closeList();
        } catch (error) {
            alert('error occured while moving the item to review');
            console.log('error', error);
        }
    }

    const closeCreateUserModal = (BL_id = null) => {
        console.log('inside close call: ', BL_id);
        setCreateUserModalOpen(false);
        getActiveLists();
        if (BL_id) {
            getActiveItems(BL_id);
        }
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
                            <Collapse in={openStates[index]} timeout="auto" unmountOnExit sx={{ backgroundColor: '#ebf0f0', border: '1px solid', borderRadius: '10px', margin: '0px 20px 0px 20px', padding: '0px 15px 0px 15px' }}>
                                <Box display="flex" alignItems="center" justifyContent="space-between" margin={3}>
                                    {/* Left Section */}
                                    <Box marginLeft={8}>
                                        <Typography variant="h6">Item List</Typography>
                                    </Box>

                                    {/* Right Section */}
                                    <Box marginRight={10}>
                                        {
                                            activeBlist.list_status === 'In-Progress' ? (
                                                <>
                                                    <Button onClick={() => addItemClick(activeBlist)} variant='contained' color='success'>
                                                        Add Item</Button>
                                                    <Button onClick={() => moveToReview(activeBlist)} variant='contained' color='primary' style={{ marginLeft: '10px' }}>
                                                        Move to Review</Button>
                                                </>
                                            ) : <>
                                                <Button onClick={() => moveBackInProgress(activeBlist)} variant='contained' color='primary' style={{ marginLeft: '10px' }}>
                                                    Move back to Progress</Button>
                                                <Button onClick={() => submitList(activeBlist)} variant='contained' color='success' style={{ marginLeft: '10px' }}>
                                                    Submit</Button>
                                            </>
                                        }
                                    </Box>
                                </Box>
                                <Table >
                                    <TableHead>
                                        <TableRow>
                                        </TableRow>
                                        <TableRow>
                                            <HeaderCenterCell>Item Name</HeaderCenterCell>
                                            <HeaderCenterCell>Quantity</HeaderCenterCell>
                                            <HeaderCenterCell>Unit Weight</HeaderCenterCell>
                                            <HeaderCenterCell>Total Weight</HeaderCenterCell>
                                            <HeaderCenterCell>Unit</HeaderCenterCell>
                                            <HeaderCenterCell>Unit Price</HeaderCenterCell>
                                            <HeaderCenterCell>Total Price</HeaderCenterCell>
                                            <HeaderCenterCell>Action</HeaderCenterCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            activeListItems.map((activeItem, index) => (
                                                <TableRow>
                                                    <CenterCell>{activeItem.item_name}</CenterCell>
                                                    <CenterCell>{activeItem.quantity}</CenterCell>
                                                    <CenterCell>{activeItem.unit_weight}</CenterCell>
                                                    <CenterCell>{activeItem.total_weight}</CenterCell>
                                                    <CenterCell>{activeItem.unit}</CenterCell>
                                                    <CenterCell>{activeItem.unit_price}</CenterCell>
                                                    <CenterCell>{activeItem.total_price}</CenterCell>
                                                    <CenterCell>
                                                        <Button variant='contained' color='primary' onClick={() => editItem({ ...activeItem, listname: activeBlist.listname })} > Edit </Button>
                                                        <Tooltip title="To be implemented" arrow>
                                                            <Button variant='contained' color='error' onClick={() => removeItem(activeItem.alist_id)} style={{ marginLeft: '10px' }} disabled > Remove </Button>
                                                        </Tooltip>
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
