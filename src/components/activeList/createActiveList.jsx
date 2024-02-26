import React, { useEffect, useState } from 'react';
import { TextField, Button, Tooltip, Dialog, DialogTitle, DialogContent, FormControl, InputLabel, Select, MenuItem, IconButton } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material'; // Import the CloseIcon
import { API } from '../../helpers/api';

const CreateActiveList = ({ isOpen, onClose, initData }) => {
    const [formInvalid, setFormInvalid] = useState(false);

    const [activeData, setActiveData] = useState({
        alist_id: null,
        BL_id: null,
        radiation: null,
        chemical: "NILL",
        hs_code: null,
        list_status: 'Not-Started',
        unit_weight: 0,
        total_weight: 0,
        unit: 'KGS',
        unit_price: 0,
        total_price: 0,
        item_name: '',
        brand: null,
        actual_quantity: 10,
        unit_pieces: 0,
        total_pieces: 0,
        final_quantity: 0,
        UOM: "PKTS",
    });

    useEffect(() => {
        setActiveData((prevData) => ({ ...prevData, ...initData }));
    }, [initData]);


    const handleInputChange = (e) => {
        setFormInvalid(false);
        const { name, value } = e.target;
        if (name === 'actual_quantity' && activeData.final_quantity === 0) {
            setActiveData((prevData) => ({ ...prevData, "final_quantity": value }));
        }
        if (name === 'final_quantity' && activeData.unit_weight !== 0) {
            setActiveData((prevData) => ({ ...prevData, "total_weight": value * activeData.unit_weight }));
        }
        if (name === 'final_quantity' && activeData.unit_price !== 0) {
            setActiveData((prevData) => ({ ...prevData, "total_price": value * activeData.unit_price }));
        }
        if (name === 'final_quantity' && activeData.unit_pieces !== 0) {
            setActiveData((prevData) => ({ ...prevData, "total_pieces": value * activeData.unit_pieces }));
        }
        if (name === "unit_weight" && activeData.final_quantity !== 0) {
            setActiveData((prevData) => ({ ...prevData, "total_weight": value * activeData.final_quantity }));
        }
        if (name === "unit_price" && activeData.final_quantity !== 0) {
            setActiveData((prevData) => ({ ...prevData, "total_price": value * activeData.final_quantity }));
        }
        if (name === "unit_pieces" && activeData.final_quantity !== 0) {
            setActiveData((prevData) => ({ ...prevData, "total_pieces": value * activeData.final_quantity }));
        }

        setActiveData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async () => {
        try {
            if (activeData.item_name === '') {
                setFormInvalid(true);
                return;
            } else {
                if (!activeData.alist_id) {
                    //create active list
                    await API.createActiveList(activeData);
                } else {
                    //update active list
                    await API.updateActiveList(activeData);
                }
            }
        } catch (error) {
            alert('some error occurred');
        }
        // Close the modal after submission
        setActiveData({
            alist_id: null,
            BL_id: null,
            radiation: null,
            chemical: "NILL",
            hs_code: null,
            list_status: 'Not-Started',
            unit_weight: 0,
            total_weight: 0,
            unit: 'KGS',
            unit_price: 0,
            total_price: 0,
            item_name: '',
            brand: null,
            actual_quantity: 10,
            unit_pieces: 0,
            total_pieces: 0,
            final_quantity: 0,
            UOM: "PKTS",
        })
        onClose();
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
                        label="HS_Code"
                        name="hs_code"
                        value={activeData.hs_code}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                        required
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
                        label="Radiation"
                        name="radiation"
                        value={activeData.radiation}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                        required
                    />
                    <TextField
                        label="Chemical"
                        name="chemical"
                        value={activeData.chemical}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                        required
                    />
                    <TextField
                        label="Brand"
                        name="brand"
                        value={activeData.brand}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                        required
                    />
                    <TextField
                        label="Actual Quantity"
                        name="actual_quantity"
                        type='number'
                        inputProps={{ min: 0 }}
                        value={activeData.actual_quantity}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Final Quantity"
                        name="final_quantity"
                        type='number'
                        inputProps={{ min: 0 }}
                        value={activeData.final_quantity}
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
                    <TextField
                        label="Unit Pieces"
                        name="unit_pieces"
                        type='number'
                        inputProps={{ min: 0 }}
                        value={activeData.unit_pieces}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                    />
                    <Tooltip title="To be calculated automatically" arrow>
                        <TextField
                            label="Total Pieces"
                            name="total_pieces"
                            type='number'
                            inputProps={{ min: 0 }}
                            value={activeData.total_pieces}
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
                    <FormControl fullWidth margin="normal">
                        <InputLabel htmlFor="role">UOM</InputLabel>
                        <Select
                            label="UOM"
                            name="UOM"
                            value={activeData.UOM}
                            onChange={handleInputChange}
                        >
                            <MenuItem value="PKTS">PKTS</MenuItem>
                            <MenuItem value="PCS">PCS</MenuItem>
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
