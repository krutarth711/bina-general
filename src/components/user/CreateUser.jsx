import React, { useState } from 'react';
import { TextField, Button, Dialog, DialogTitle, DialogContent, Typography, FormControl, InputLabel, Select, MenuItem, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const CreateUser = ({ isOpen, onClose }) => {
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
    const { name, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = () => {
    // Add logic to handle form submission (e.g., API call, validation)
    // For simplicity, just log the user data in this example
    console.log('User Data:', userData);

    // Close the modal after submission
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
          />
          <TextField
            label="Email"
            name="email"
            value={userData.email}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={userData.password}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
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
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateUser;