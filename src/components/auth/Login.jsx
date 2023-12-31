import { useState, useContext, useEffect } from 'react';

import { TextField } from '@mui/material';

import { Component, Error, Image, LoginButton, Wrapper, ImageHeader } from './Login.style';

import { API } from '../../helpers/api';
import { DataContext } from '../../contexts/authContext';

import { AuthenticationDetails, CognitoUser, CognitoUserPool } from 'amazon-cognito-identity-js';

import { useNavigate } from 'react-router-dom';

const loginInitialValues = {
    username: '',
    password: ''
}

const userPoolId = 'us-east-1_h5WyRsDNd';
const clientId = '41rkll3rdbugfvlen2bj327i26';
const region = 'us-east-1';

const userPool = new CognitoUserPool({
    UserPoolId: userPoolId,
    ClientId: clientId,
    region: region,
});

const Login = () => {
    const imageURL = 'https://www.sesta.it/wp-content/uploads/2021/03/logo-blog-sesta-trasparente.png'

    const [login, setLogin] = useState(loginInitialValues);
    const [error, setError] = useState('');

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

        const authenticationData = {
            Username: login.username,
            Password: login.password,
        };

        const authenticationDetails = new AuthenticationDetails(authenticationData);

        const userData = {
            Username: login.username,
            Pool: userPool,
        };

        const cognitoUser = new CognitoUser(userData);

        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: (session) => {
                console.log('Authentication successful', session);
                const accessToken = session.getAccessToken().getJwtToken();
                const refreshToken = session.getRefreshToken().getToken();

                sessionStorage.setItem('accessToken', 'Bearer ' + accessToken);
                sessionStorage.setItem('refreshToken', 'Bearer ' + refreshToken);
                sessionStorage.setItem('username', login.username);

                // Additional logic if needed...

                setAccount({ username: login.username });

                console.log('set the authentication to true');
                navigate('/');
            },
            onFailure: (error) => {
                console.error('Authentication failed', error);
                setError('Authentication failed. Please try again.');
            },
        });

        // const response = await API.userLogin(login);
        // console.log();
        // if (response.isSuccess) {
        //     console.log('response.data::', response.data.token);
        //     setError('');
        //     sessionStorage.setItem('accessToken', 'Bearer ' + response.data.token);
        //     sessionStorage.setItem('refreshToken', 'Bearer ' + response.data.refreshToken);
        //     sessionStorage.setItem('username', response.data.username);
        //     sessionStorage.setItem('role', response.data.role);
        //     console.log(JSON.stringify({ username: response.data.username, role: response.data.role }));

        //     setAccount({ username: response.data.username, role: response.data.role })

        //     console.log('set the authentication to true::: ');

        //     navigate('/');
        // } else {
        //     setError('Something went wrong! Please try again.');
        // }
    }

    return (
        <Component>
            <ImageHeader>Bina General</ImageHeader>
            <Wrapper>
                <TextField id="username" value={login.username} name="username" onChange={(e) => onLoginInputChange(e)} label="Enter Username" variant="standard" />
                <TextField id="password" value={login.password} name="password" onChange={(e) => onLoginInputChange(e)} label="Enter Password" variant="standard" type={'password'} />
                {error && <Error>{error}</Error>}
                <LoginButton variant="contained" onClick={() => loginUser()}>Login</LoginButton>
            </Wrapper>
        </Component>
    )
}

export default Login;