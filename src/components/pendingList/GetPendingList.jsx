import React, { useEffect, useState } from 'react';

import { API } from '../../helpers/api';

import { CenterCell, HeaderCenterCell } from './pendingList.style';

import { Box, Typography, Table, TableHead, TableRow, TableBody, Button, Divider, CssBaseline, Dialog, DialogTitle, DialogContent } from '@mui/material';
import axios from 'axios';

const GetPendingList = () => {
    const [file, setFile] = useState(null);
    const [fileData, setFileData] = useState({ fileName: '', fileType: '' });
    const [pendingList, setPendingList] = useState([]);

    useEffect(() => {
        getPendingLists();
    }, [])

    const getPendingLists = async () => {
        const response = await API.getPendingLists();
        console.log('response: ', response.data);
        setPendingList(response.data.plists || [])
    }

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
        setFileData({ fileName: event.target.files[0].name, fileType: event.target.files[0].type })
    };

    const handleUpload = async () => {
        if (!file) {
            console.error('No file selected.');
            return;
        }

        try {
            const response = await API.getS3URL(fileData);
            console.log('response from aws:: ', response);

            if (response.data && response.data.signedUrl) {
                await axios.put(response.data.signedUrl, file, {
                    headers: {
                        'Content-Type': file.type,
                    },
                });

                const mysqlUpdateResponse = await API.updateMySQL({ uploadTime: response.data.uploadTime, fileName: fileData.fileName });
                console.log('mysqlUpdateResponse: ', mysqlUpdateResponse);
                getPendingLists();
            }
        } catch (error) {
            console.error('Error getting signed URL:', error);
            alert('Error uploading the file');
            // Handle error or display an error message
        }
    };

    const downloadFile = async (s3FileUrl) => {
        window.open(s3FileUrl);

        // try {
        //     const response = await axios.get(s3FileUrl, {
        //         responseType: 'blob',
        //         headers: {
        //             'Content-Type': 'application/pdf',
        //         },
        //     });

        //     // Create a blob from the response and initiate a download
        //     const url = window.URL.createObjectURL(new Blob([response.data]));
        //     const a = document.createElement('a');

        //     // Set the download attribute and create a clickable link
        //     a.href = url;
        //     a.download = 'downloaded-file'; // You can set the desired file name here
        //     document.body.appendChild(a);

        //     // Trigger the click event to start the download
        //     a.click();

        //     // Remove the link from the DOM
        //     document.body.removeChild(a);
        // } catch (error) {
        //     console.error('Error:', error.message);
        // }
    };

    return (
        <>
            <Box width='100%' marginLeft='30px'>
                <Box display="flex" alignItems="center" justifyContent="space-between" margin={3}>
                    {/* Left Section */}
                    <Box marginLeft={8}>
                        <Typography variant="h4">Pending Lists</Typography>
                    </Box>

                    {/* Right Section */}
                    <Box marginRight={15}>
                        <div>
                            <input type="file" onChange={handleFileChange} />
                            <Button onClick={handleUpload}>
                                Upload</Button>
                        </div>
                        {/* <Button variant="contained" color="primary" onClick={openCreateUserModal}>
                            Create User
                        </Button> */}
                    </Box>
                </Box>
                <Divider />
                <Table >
                    <TableHead>
                        <TableRow>
                            <HeaderCenterCell>Filename</HeaderCenterCell>
                            {/* <HeaderCenterCell>Role</HeaderCenterCell>
                            <HeaderCenterCell>Email</HeaderCenterCell> */}
                            <HeaderCenterCell>Action</HeaderCenterCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            pendingList.map(pl => (
                                <TableRow>
                                    <CenterCell>{pl.listname}</CenterCell>
                                    <CenterCell>
                                        <Button variant='contained' color='success' onClick={() => downloadFile(pl.s3_url)}> Download </Button>
                                    </CenterCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </Box>
        </>
        // <div>
        //     <input type="file" onChange={handleFileChange} />
        //     <Button onClick={handleUpload}>
        //         Upload</Button>
        // </div>
    );
}

export default GetPendingList;
