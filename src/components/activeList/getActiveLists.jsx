import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { List, ListItemButton, Typography, Box } from '@mui/material';
import GetActiveSingleList from './getActiveSingleList';


import { API } from '../../helpers/api';

const GetActiveList = () => {
    const navigate = useNavigate();

    const [selectedList, setSelectedList] = useState(null);

    const [activeBLists, setActiveBLists] = useState([]);

    const handleListClick = async (list) => {
        navigate(`/active-list/${list.plist_id}`);
        setSelectedList(list);
    };

    useEffect(() => {
        const fetchData = async () => {
            await getActiveLists();
        };
        fetchData();
    }, [])

    const getActiveLists = async () => {
        const activeListsData = await API.getActivePendingLists({ status: true });
        setActiveBLists(activeListsData?.data?.plists || []);
    }

    return (
        <div>
            <Box maxWidth='100%' margin='30px'>
                <Typography variant="h4">Active Lists</Typography>
                <List sx={{ width: '100%', maxWidth: '100%', bgcolor: 'background.paper' }}>
                    {activeBLists.map((list, index) => (
                        <ListItemButton key={index} onClick={() => handleListClick(list)} elevation={3} style={{ marginTop: "10px", minHeight: "35px", background: '#EFEFEF' }}>
                            <Typography>{list.listname}</Typography>
                            <br />
                        </ListItemButton>
                    ))}
                </List>
                {selectedList && <GetActiveSingleList list={selectedList} />}
            </Box>
        </div >
    );
}

export default GetActiveList;
