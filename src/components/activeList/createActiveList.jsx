import React, { useEffect, useState } from 'react';
import { TextField, Button, Tooltip, Backdrop, CircularProgress, Dialog, DialogTitle, DialogContent, Typography, FormControl, InputLabel, Select, MenuItem, IconButton, InputAdornment } from '@mui/material';
import { API } from '../../helpers/api';

const CreateActiveList = ({ isOpen, onClose, initData }) => {
    const [formInvalid, setFormInvalid] = useState(false);

    const [activeData, setActiveData] = useState({
        alist_id: null,
        BL_id: null,
        filename: '',
        list_status: 'Not-Started',
        quantity: 0,
        unit_weight: 0,
        total_weight: 0,
        unit: 'KG',
        total_price: 0,
        unit_price: 0,
        item_name: '',
        submit_url: ''
    });

    useEffect(() => {
        setActiveData((prevData) => ({ ...prevData, ...initData }));
    }, []);


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
        console.log('INIT DATA at submit: ', initData);
        try {
            if (activeData.item_name === '') {
                setFormInvalid(true);
                return;
            }
            //create active list api call
            // await API.createUser(activeData);
        } catch (error) {
            alert('some error occurred');
            console.log(error);
        }
        // Close the modal after submission
        onClose();
    };

    return (
        <Dialog open={isOpen}>
            <DialogTitle>Create active list</DialogTitle>
            <DialogContent>
                <form>
                    <TextField
                        label="Filename"
                        name="filename"
                        value={activeData.filename}
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
                            <MenuItem value="KG">KG</MenuItem>
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
