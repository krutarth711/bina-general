import { useState, useContext, useEffect } from 'react';

import { TextField, Backdrop, CircularProgress } from '@mui/material';

import { Component, Error, Image, LoginButton, Wrapper } from './Login.style';
import imageUrl from '../../assets/Bina-general-trading-logo.png';

import { API } from '../../helpers/api';
import { DataContext } from '../../contexts/authContext';

import { useNavigate } from 'react-router-dom';

const loginInitialValues = {
    username: '',
    password: ''
}

const Login = () => {
    // const imageURL = 'https://www.sesta.it/wp-content/uploads/2021/03/logo-blog-sesta-trasparente.png'
    // const imageURL = '../../assets/Bina-general-trading-logo.png';

    const [login, setLogin] = useState(loginInitialValues);
    const [error, setError] = useState('');
    const [openLoader, setOpenLoader] = useState(false);

    const { account, setAccount } = useContext(DataContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (account.username) {
            navigate('/');
        }
    }, [])

    const onLoginInputChange = async (e) => {
        setLogin({ ...login, [e.target.name]: e.target.value });
    }


    const loginUser = async () => {
        setOpenLoader(true);
        const response = await API.userLogin(login);
        if (response.isSuccess) {
            console.log('response::', response);
            console.log('response.data::', response.data.token);
            sessionStorage.setItem('accessToken', 'Bearer ' + response.data.token);
            // sessionStorage.setItem('refreshToken', 'Bearer ' + response.data.refreshToken);
            sessionStorage.setItem('username', response.data.username);
            sessionStorage.setItem('role', response.data.role);
            console.log(JSON.stringify({ username: response.data.username, role: response.data.role }));

            setAccount({ username: response.data.username, role: response.data.role })

            console.log('set the authentication to true::: ');
            setOpenLoader(false);
            navigate('/');
        } else {
            setError('Something went wrong! Please try again.');
        }
    }

    return (
        <Component>
            <Image src={imageUrl} alt="login" />
            <Wrapper>
                <TextField id="username" value={login.username} name="username" onChange={(e) => onLoginInputChange(e)} label="Enter Username" variant="standard" />
                <TextField id="password" value={login.password} name="password" onChange={(e) => onLoginInputChange(e)} label="Enter Password" variant="standard" type={'password'} />
                {error && <Error>{error}</Error>}
                <LoginButton variant="contained" onClick={() => loginUser()}>Login</LoginButton>
            </Wrapper>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={openLoader}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </Component>
    )
}

export default Login;