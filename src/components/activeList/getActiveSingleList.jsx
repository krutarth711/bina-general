import React, { useEffect, useState } from 'react';
import { List, ListItemButton, TextField, Backdrop, CircularProgress, Tooltip, Table, TableHead, TableBody, TableRow, Button, Typography, ListItemIcon, ListItemText, Collapse, Box } from '@mui/material';

import { CenterCell, HeaderCenterCell } from './activeList.styles';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { API } from '../../helpers/api';
import CreateActiveList from './createActiveList';

const GetActiveSingleList = ({ list }) => {

    const location = useLocation();
    const [activeItems, setActiveItems] = useState([]);
    const [activeListName, setActiveListName] = useState('new list');
    const [activeListStatus, setActiveListStatus] = useState('In-Progress');
    const [isCreateUserModalOpen, setCreateUserModalOpen] = useState(false);
    const [openLoader, setOpenLoader] = useState(false);

    const navigate = useNavigate();

    const [createActiveListData, setCreateActiveListData] = useState({
        alist_id: '',
        hs_code: '',
        radiation: '',
        chemical: '',
        item_name: '',
        brand: '',
        actual_quantity: '',
        unit_weight: '',
        total_weight: '',
        unit: '',
        UOM: '',
        unit_pieces: '',
        total_pieces: '',
        unit_price: '',
        total_price: '',
        final_quantity: ''
    });

    let { BL_id } = useParams();
    BL_id = parseInt(BL_id, 10);
    console.log('bl_id in param:: ', BL_id);

    useEffect(() => {
        console.log('location. state after assigning:: ', createActiveListData);
        if (createActiveListData.BL_id) {
            setCreateUserModalOpen(true);
        }
    }, [createActiveListData])

    useEffect(() => {
        getActiveItems();
        //open create active list item, if we got a request for it directly from pending lists screen
        const fetchData = async () => {
            if (location?.state) {
                console.log('location. state:: ', location.state);
                setCreateActiveListData((prevData) => ({ ...prevData, ...location.state }));
            }
        };
        fetchData();
    }, []);

    const getActiveItems = async () => {
        setOpenLoader(true);
        console.log('passing BL_id:: ', BL_id);
        console.log('TYPE BL_id:: ', typeof BL_id);
        const activeListItemsData = await API.getActiveListItems({ BL_id });
        console.log('activeListItemsData:', activeListItemsData);
        if (activeListItemsData?.data?.alists) {
            setActiveItems(activeListItemsData.data.alists);
        }
        if (activeListItemsData?.data?.plist) {
            setActiveListName(activeListItemsData.data.plist?.listname)
            setActiveListStatus(activeListItemsData.data.plist?.list_status);
        }
        setOpenLoader(false);
    };

    const addItemClick = (activeBlist) => {
        console.log('ACTIVE BLIST: ', activeBlist);
        setCreateActiveListData({
            alist_id: null,
            BL_id: BL_id,
            hs_code: null,
            radiation: null,
            chemical: 'NILL',
            item_name: '',
            brand: '',
            actual_quantity: 0,
            unit_weight: 0,
            total_weight: 0,
            unit: 'KGS',
            UOM: 'PKTS',
            unit_pieces: 0,
            total_pieces: 0,
            unit_price: 0,
            total_price: 0,
            final_quantity: 0
        });
        setCreateUserModalOpen(true);
    };

    const moveToReview = async () => {
        try {
            await API.updatePendingList({ plist_id: BL_id, status: 'In-Review' });
        } catch (error) {
            console.log('Error in moving it to review', error);
        }
        navigate('/active-list');
    };

    const moveBackInProgress = async () => {
        try {
            await API.updatePendingList({ plist_id: BL_id, status: 'In-Progress' });
        } catch (error) {
            console.log('Error in moving the list back in progress', error);
        }
        navigate('/active-list');
    };

    const submitList = async () => {
        setOpenLoader(true);
        try {
            await API.generateInvoice({ BL_id });
        } catch (error) {
            console.log('Error in submitting the list: ', error);
        }
        setOpenLoader(false);
        navigate('/active-list');
        console.log('submitList clicked :');
    };

    const editItem = (activeItem) => {
        console.log('Will be edited:', activeItem);
        setCreateActiveListData((prevData) => ({ ...prevData, ...activeItem }));
        setCreateUserModalOpen(true);
    }

    const removeItem = async (alist_id) => {
        console.log('it will remove an item');
        try {
            await API.deleteActiveList({ alist_id });
        } catch (error) {
            console.log('error deleting');
        }
        getActiveItems();
    }

    const closeCreateUserModal = () => {
        setCreateUserModalOpen(false);
        getActiveItems();
    };

    return (
        <>
            <Box display="flex" alignItems="center" justifyContent="space-between" margin={3}>
                {/* Left Section */}
                <Box marginLeft={8}>
                    <Typography variant="h6">{activeListName}</Typography>
                </Box>

                {/* Right Section */}
                <Box marginRight={10}>
                    {
                        activeListStatus === 'In-Progress' ? (
                            <>
                                <Button onClick={() => addItemClick()} variant='contained' color='success'>
                                    Add Item</Button>
                                <Button onClick={() => moveToReview()} variant='contained' color='primary' style={{ marginLeft: '10px' }}>
                                    Move to Review</Button>
                            </>
                        ) : <>
                            <Button onClick={() => moveBackInProgress()} variant='contained' color='primary' style={{ marginLeft: '10px' }}>
                                Move back to Progress</Button>
                            <Button onClick={() => submitList()} variant='contained' color='success' style={{ marginLeft: '10px' }}>
                                Submit</Button>
                        </>
                    }
                </Box>
            </Box>
            <Box margin={5}>
                <Table >
                    <TableHead>
                        <TableRow>
                        </TableRow>
                        <TableRow>
                            <HeaderCenterCell>Sr. No.</HeaderCenterCell>
                            <HeaderCenterCell>HSCode</HeaderCenterCell>
                            <HeaderCenterCell>Radiation</HeaderCenterCell>
                            <HeaderCenterCell>Chemical</HeaderCenterCell>
                            <HeaderCenterCell>Item Name</HeaderCenterCell>
                            <HeaderCenterCell>Brand</HeaderCenterCell>
                            <HeaderCenterCell>Actual Quantity</HeaderCenterCell>
                            <HeaderCenterCell>Unit Weight</HeaderCenterCell>
                            <HeaderCenterCell>Total Weight</HeaderCenterCell>
                            <HeaderCenterCell>Unit</HeaderCenterCell>
                            <HeaderCenterCell>UOM</HeaderCenterCell>
                            <HeaderCenterCell>Unit Pieces</HeaderCenterCell>
                            <HeaderCenterCell>Total Pieces</HeaderCenterCell>
                            <HeaderCenterCell>Unit Price</HeaderCenterCell>
                            <HeaderCenterCell>Total Price</HeaderCenterCell>
                            <HeaderCenterCell>Final Quantity</HeaderCenterCell>
                            <HeaderCenterCell>Action</HeaderCenterCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            activeItems.map((activeItem, index) => (
                                <TableRow>
                                    <CenterCell>{index + 1}</CenterCell>
                                    <CenterCell>{activeItem.hs_code || 0}</CenterCell>
                                    <CenterCell>{activeItem.radiation || '-'}</CenterCell>
                                    <CenterCell>{activeItem.chemical || '-'}</CenterCell>
                                    <CenterCell>{activeItem.item_name || '-'}</CenterCell>
                                    <CenterCell>{activeItem.brand || '-'}</CenterCell>
                                    <CenterCell>{activeItem.actual_quantity}</CenterCell>
                                    <CenterCell>{activeItem.unit_weight}</CenterCell>
                                    <CenterCell>{activeItem.total_weight}</CenterCell>
                                    <CenterCell>{activeItem.unit}</CenterCell>
                                    <CenterCell>{activeItem.UOM}</CenterCell>
                                    <CenterCell>{activeItem.unit_pieces}</CenterCell>
                                    <CenterCell>{activeItem.total_pieces}</CenterCell>
                                    <CenterCell>{activeItem.unit_price}</CenterCell>
                                    <CenterCell>{activeItem.total_price}</CenterCell>
                                    <CenterCell>{activeItem.final_quantity}</CenterCell>
                                    <CenterCell>
                                        {
                                            <>
                                                <Button variant='contained' color='primary' onClick={() => editItem(activeItem)} > Edit </Button>
                                                <Tooltip title="To be implemented" arrow>
                                                    <Button variant='contained' color='error' onClick={() => removeItem(activeItem.alist_id)} style={{ marginLeft: '10px' }} > Remove </Button>
                                                </Tooltip>
                                            </>
                                        }

                                    </CenterCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
                <CreateActiveList isOpen={isCreateUserModalOpen} onClose={closeCreateUserModal} initData={createActiveListData} />
            </Box>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={openLoader}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </>
    );
}

export default GetActiveSingleList;
