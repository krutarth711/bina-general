import React, { useState } from 'react';
import { TextField, Button, Dialog, DialogTitle, DialogContent, FormControl, InputLabel, Select, MenuItem, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { API } from '../../helpers/api';

const CreateUser = ({ isOpen, onClose }) => {
  const [formInvalid, setFormInvalid] = useState(false);

  const [userData, setUserData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'Staff'
  });

  const [showPassword, setShowPassword] = useState(false)

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleInputChange = (e) => {
    setFormInvalid(false);
    const { name, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async () => {
    // Add logic to handle form submission (e.g., API call, validation)
    // For simplicity, just log the user data in this example
    if (!userData.username || !userData.email || !userData.password) {
      // Display an error message or handle the validation as needed
      console.error('Please fill in all required fields');
      setFormInvalid(true);
      return;
    }
    try {
      await API.createUser(userData);
    } catch (error) {
      alert('some error occurred');
      console.log(error);
    }
    // Close the modal after submission
    setUserData({
      username: '',
      email: '',
      password: '',
      role: 'Staff'
    })
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Create a User</DialogTitle>
      <DialogContent>
        <form>
          <TextField
            label="Username"
            name="username"
            value={userData.username}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Email"
            name="email"
            value={userData.email}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={userData.password}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleTogglePasswordVisibility}>
                    {!showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel htmlFor="role">Role</InputLabel>
            <Select
              label="Role"
              name="role"
              value={userData.role}
              onChange={handleInputChange}
            >
              <MenuItem value="Super Admin">Super Admin</MenuItem>
              <MenuItem value="Admin">Admin</MenuItem>
              <MenuItem value="Staff">Staff</MenuItem>
            </Select>
          </FormControl>
          {/* Add more form fields as needed */}
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Create
          </Button>
          {formInvalid ? <p style={{ color: 'red' }}>Please fill all the fields!</p> : <></>}

        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateUser;