import React, { useEffect, useState } from 'react';
import { TextField, Button, Tooltip, Backdrop, CircularProgress, Dialog, DialogTitle, DialogContent, Typography, FormControl, InputLabel, Select, MenuItem, IconButton, InputAdornment } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material'; // Import the CloseIcon
import { API } from '../../helpers/api';

const CreateActiveList = ({ isOpen, onClose, initData }) => {
    const [formInvalid, setFormInvalid] = useState(false);

    const [activeData, setActiveData] = useState({
        alist_id: null,
        BL_id: null,
        listname: '',
        list_status: 'Not-Started',
        quantity: 0,
        unit_weight: 0,
        total_weight: 0,
        unit: 'KGS',
        total_price: 0,
        unit_price: 0,
        item_name: ''
    });

    useEffect(() => {
        setActiveData((prevData) => ({ ...prevData, ...initData }));
    }, [initData]);


    const handleInputChange = (e) => {
        setFormInvalid(false);
        const { name, value } = e.target;
        if (name === 'quantity' && activeData.unit_weight !== 0) {
            setActiveData((prevData) => ({ ...prevData, "total_weight": value * activeData.unit_weight }));
        }
        if (name === 'quantity' && activeData.unit_price !== 0) {
            setActiveData((prevData) => ({ ...prevData, "total_price": value * activeData.unit_price }));
        }
        if (name === "unit_weight" && activeData.quantity !== 0) {
            setActiveData((prevData) => ({ ...prevData, "total_weight": value * activeData.quantity }));
        }
        if (name === "unit_price" && activeData.quantity !== 0) {
            setActiveData((prevData) => ({ ...prevData, "total_price": value * activeData.quantity }));
        }
        setActiveData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async () => {
        console.log('ACTIVE DATA: ', activeData);
        try {
            if (activeData.item_name === '') {
                setFormInvalid(true);
                return;
            } else {
                if (activeData.alist_id === null) {
                    //create active list
                    console.log('should send the req:');
                    await API.createActiveList(activeData);
                } else {
                    //update active list
                    console.log('IT SHOULD CALL UPDATE');
                    await API.updateActiveList(activeData);
                }
            }
        } catch (error) {
            alert('some error occurred');
            console.log(error);
        }
        // Close the modal after submission
        onClose(activeData.BL_id);
    };

    return (
        <Dialog open={isOpen}>
            <DialogTitle>Create active list
                <IconButton
                    edge="end"
                    color="inherit"
                    onClick={() => onClose()}
                    aria-label="close"
                    style={{ position: 'absolute', right: 8, top: 8 }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <form>
                    <TextField
                        label="listname"
                        name="listname"
                        value={activeData.listname}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                        disabled
                    />
                    <TextField
                        label="Item Name"
                        name="item_name"
                        value={activeData.item_name}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                        required
                    />
                    <TextField
                        label="Quantity"
                        name="quantity"
                        type='number'
                        inputProps={{ min: 0 }}
                        value={activeData.quantity}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                    />

                    <TextField
                        label="Unit Weight"
                        name="unit_weight"
                        type='number'
                        inputProps={{ min: 0 }}
                        value={activeData.unit_weight}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                    />
                    <Tooltip title="To be calculated automatically" arrow>
                        <TextField
                            label="Total Weight"
                            name="total_weight"
                            type='number'
                            inputProps={{ min: 0 }}
                            value={activeData.total_weight}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            disabled
                        />
                    </Tooltip>
                    <TextField
                        label="Unit Price"
                        name="unit_price"
                        type='number'
                        inputProps={{ min: 0 }}
                        value={activeData.unit_price}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                    />
                    <Tooltip title="To be calculated automatically" arrow>
                        <TextField
                            label="Total Price"
                            name="total_price"
                            type='number'
                            inputProps={{ min: 0 }}
                            value={activeData.total_price}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            disabled
                        />
                    </Tooltip>
                    <FormControl fullWidth margin="normal">
                        <InputLabel htmlFor="role">Unit</InputLabel>
                        <Select
                            label="Unit"
                            name="unit"
                            value={activeData.unit}
                            onChange={handleInputChange}
                        >
                            <MenuItem value="KGS">KGS</MenuItem>
                            <MenuItem value="GRMS">GRMS</MenuItem>
                            <MenuItem value="MLS">MLS</MenuItem>
                        </Select>
                    </FormControl>
                    {/* Add more form fields as needed */}
                    <Button variant="contained" color="primary" onClick={handleSubmit} disabled={formInvalid}>
                        Save
                    </Button>
                    {formInvalid ? <p style={{ color: 'red' }}>Please enter the item at least!</p> : <></>}

                </form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateActiveList;
