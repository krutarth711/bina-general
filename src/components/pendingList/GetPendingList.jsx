import React, { useEffect, useState } from 'react';

import { API } from '../../helpers/api';

import { CenterCell, HeaderCenterCell } from './pendingList.style';
import { useNavigate } from 'react-router-dom';

import { Box, Typography, Backdrop, CircularProgress, Table, TableHead, TableRow, TableBody, Button, Divider } from '@mui/material';
import axios from 'axios';

const GetPendingList = () => {
    const [file, setFile] = useState(null);
    const [fileData, setFileData] = useState({ fileName: '', fileType: '' });
    const [pendingList, setPendingList] = useState([]);
    const [openLoader, setOpenLoader] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        getPendingLists();
    }, [])

    const getPendingLists = async () => {
        try {
            setOpenLoader(true);
            const response = await API.getPendingLists();
            if (!response.data) {
                navigate('/login');
                return;
            }
            setPendingList(response.data?.plists || []);
            setOpenLoader(false);
        } catch (error) {
            setPendingList([])
            setOpenLoader(false);
        }
    }

    const handleFileChange = (event) => {
        if (event.target.files[0]) {
            setFile(event.target.files[0]);
            setFileData({ fileName: event.target.files[0].name, fileType: event.target.files[0].type });
        }
    };

    const handleUpload = async () => {
        setOpenLoader(true);
        if (!file) {
            console.error('No file selected.');
            return;
        }

        try {
            const response = await API.getS3URL(fileData);

            if (response.data && response.data.signedUrl) {
                await axios.put(response.data.signedUrl, file, {
                    headers: {
                        'Content-Type': file.type,
                    },
                });

                await API.updateMySQL({ uploadTime: response.data.uploadTime, fileName: fileData.fileName });
                setFile(null);
                setFileData({ fileName: '', fileType: '' });
                setOpenLoader(false);
                getPendingLists();
            }
        } catch (error) {
            setOpenLoader(false);
            alert('Error uploading the file');
            // Handle error or display an error message
        }
    };

    const createActive = async (PLInfo) => {
        PLInfo.BL_id = PLInfo.plist_id;
        navigate(`/active-list/${PLInfo.plist_id}`, { state: PLInfo })
    }

    const downloadFile = async (s3FileUrl) => {
        window.open(s3FileUrl);
    };

    return (
        <>
            <Box maxWidth='100%' marginLeft='30px'>
                <Box display="flex" alignItems="center" justifyContent="space-between" margin={3}>
                    {/* Left Section */}
                    <Box marginLeft={8}>
                        <Typography variant="h4">Pending Lists</Typography>
                    </Box>

                    {/* Right Section */}
                    <Box marginRight={15}>
                        <input type="file" onChange={handleFileChange} />
                        <Button onClick={handleUpload} variant='contained' color='primary' disabled={file === null}>
                            Upload</Button>
                    </Box>
                </Box>
                <Divider />
                <Table >
                    <TableHead>
                        <TableRow>
                            <HeaderCenterCell>Sr. No</HeaderCenterCell>
                            <HeaderCenterCell>Filename</HeaderCenterCell>
                            <HeaderCenterCell>Created Date</HeaderCenterCell>
                            {/* <HeaderCenterCell>Role</HeaderCenterCell>
                            <HeaderCenterCell>Email</HeaderCenterCell> */}
                            <HeaderCenterCell>Status</HeaderCenterCell>
                            <HeaderCenterCell>Action</HeaderCenterCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            pendingList.map((pl, index) => (
                                <TableRow>
                                    <CenterCell>{index + 1}</CenterCell>
                                    <CenterCell>{pl.listname}</CenterCell>
                                    <CenterCell>{pl.created_date}</CenterCell>
                                    <CenterCell>{pl.list_status}</CenterCell>
                                    <CenterCell>
                                        <Button variant='contained' color='success' onClick={() => downloadFile(pl.s3_url)}> View </Button>
                                        <Button variant='contained' style={{ marginLeft: "10px" }} color='primary' onClick={() => createActive(pl)}> Create </Button>
                                    </CenterCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={openLoader}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
            </Box>
        </>
    );
}

export default GetPendingList;
