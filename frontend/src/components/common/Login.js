import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import swal from 'sweetalert';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import  {FormHelperText}  from '@mui/material';
import setCookie from '../extra/setCookie';
import { GoogleOAuthProvider } from "@react-oauth/google";
import { GoogleLogin } from '@react-oauth/google';
import jwt_decode from "jwt-decode";


const Login = (props) => {
    const [Email, setEmail] = useState('');
    const [Password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [passError, setPassError] = useState('');


    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };
    
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const onChangeEmail = (event) => {
		setEmail(event.target.value);
	};

    const onChangePassword = (event) => {
        setPassword(event.target.value);
    };

    const resetInputs = () => {
		setEmail('');
        setPassword('');
    };

    const googleSuccess = (credentialResponse) => {
        // console.log("Google login successful. User details:", credentialResponse);
        const decode = credentialResponse.credential
        var profile = jwt_decode(decode);
        const {iat,exp,...restofparams} = profile
        // console.log(profile.email);


        axios.post('http://localhost:4000/user/googlelogin', restofparams)
            .then((res) => {
                if (res.data.user === undefined) {
                    console.log("User not found! Please register first.");
                    swal('Error', 'User not found! Please register first.', 'error');
                }
                else{
                // console.log(res.data.user)
                const {token,refreshToken} = res.data
                console.log('Successfully logged in!!');
                    // console.log(res.data.user.userStatus);
                    localStorage.setItem('isLoggedIn', true);
                    localStorage.setItem('user', JSON.stringify(res.data.user));
                    // console.log(res.type);
                
                    if (res.data.user.userStatus === 'Vendor') {
                        localStorage.setItem('page', '/vendor');
                        setCookie('jwt', token, 1);
                        setCookie('refresh', refreshToken, 1);

                        window.location='/vendor';
                    } else {
                        localStorage.setItem('page', '/buyer');
                        setCookie('jwt', token, 1);
                        setCookie('refresh', refreshToken, 1);

                        window.location='/buyer';
                    }
                }
            })
            .catch((err) => {
                console.log("Error",err.response.data.errMsg);
            })
        
        
      };
    
      const googleFailure = (response) => {
        console.log("response");
        console.log(response);
        // navigate('/')
      };

    const navigate = useNavigate();

    const onSubmit = (event) => {
        event.preventDefault();

       

        if (Email === '' && Password === '') {
            setPassError('Password is required');
            setEmailError('Email is required');
            
            // swal('Error', 'Please enter all details', 'error');
            resetInputs(); return;
        }
        else if (Email === '') {
            // swal('Error', 'Please enter email', 'error');
            setEmailError('Email is required');
            resetInputs(); return;
        }
        else if(!String(Email).toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        ))
        {
            // swal('Error', 'Please enter valid email', 'error');
            setEmailError('Invalid Email Id');
            return;
        }
        else if (Password === '') {
            // swal('Error', 'Please enter password', 'error');
            setPassError('Password is required');
            setEmailError('')
            // resetInputs(); 
            return;
        }        
        else{
            setPassError('');
            setEmailError('');
        }
        const thisUser = {
            Email: Email,
            Password: Password
        };
        console.log(thisUser);

        axios                               
            .post('http://localhost:4000/user/login', thisUser)
            .then((response) => {
                console.log(response.data)
                const {token,refreshToken} = response.data
                console.log(token)
                
                const res = response.data;
                // console.log(res)
                if (res.code === -1) {
                    console.log('Router error');
                    console.log(res);
                } else if (res.code === 0) {
                    swal('User does not exist', 'There is no user registered by this email. Please check the entered email.', 'warning'); 
                    resetInputs();
                } else if (res.code === 2) {
                    swal('Incorrect password', 'Please enter the correct password', 'error');
                    setPassword('');
                } else {
                    console.log('Successfully logged in!!');
                    console.log(res.user);
                    localStorage.setItem('isLoggedIn', true);
                    localStorage.setItem('user', JSON.stringify(res.user));
                    // console.log(res.type);
                    resetInputs();
                    if (res.user.userStatus === 'Vendor') {
                        localStorage.setItem('page', '/vendor');
                        setCookie('jwt', token, 1);
                        setCookie('refresh', refreshToken, 1);

                        window.location='/vendor';
                    } else {
                        localStorage.setItem('page', '/buyer');
                        setCookie('jwt', token, 1);
                        setCookie('refresh', refreshToken, 1);

                        window.location='/buyer';
                    }
                }
            })
            .catch((err) => {
                console.log(err.response.data.errMsg);
            })

        resetInputs();
    }

    return (
        <Grid container  align={'center'}  spacing={2}>
            <Grid item xs={12}>
                <TextField
                    label='Email'
                    variant='outlined'
                    value={Email}
                    FormHelperTextProps={{
                        style: { color: 'red' }
                      }}
                    onChange={onChangeEmail}
                    helperText={emailError}
                />
            </Grid>
            <Grid item xs={12}>
                <FormControl sx={{ m: 1, width: '27ch' }} variant="outlined" size='normal'>
                
                    <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                    
                    <OutlinedInput
                        id="outlined-adornment-password"
                        type={showPassword ? 'text' : 'password'}
                        value={Password}
                        onChange={onChangePassword}
                        endAdornment={
                        <InputAdornment position="end">
                            
                            <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                            
                            >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                            
                            </IconButton>
                            
                        </InputAdornment>
                        
                        }
                        
                        label="Password"
                        
                    /> 
                    <FormHelperText style={{color : "red"}}>
                            {passError}
                    </FormHelperText>
                </FormControl>
            </Grid>
            <Grid item xs={12}>
                <Button variant='contained' onClick={onSubmit} >
                    Login
                </Button>
                <GoogleOAuthProvider clientId="91399337985-i8etmi3ndi8v554fk5t28er9oioh7h3a.apps.googleusercontent.com">
                    <GoogleLogin
                        onSuccess={googleSuccess}
                        onError={googleFailure}
                    />
                </GoogleOAuthProvider>
            </Grid>
        </Grid>
        
    );
};

export default Login;