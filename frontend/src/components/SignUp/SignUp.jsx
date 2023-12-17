import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { Link as ReactLink, Outlet, useHistory } from "react-router-dom";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import {InputLabel} from "@mui/material";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { createTheme, ThemeProvider, useTheme  } from '@mui/material/styles';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="/">
        WorkingCampusLand
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const defaultTheme = createTheme();

const schema = yup.object().shape({
    Username: yup
      .string()
      .required("Username is required")
      .min(3, "Username must be at least 3 characters long")
      .max(100, "Username must be at most 100 characters long")
      .matches(
        /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ ,.\s'"!?-]+$/,
        "Username must be a text without special characters"
      ),
    Email: yup
      .string()
      .required("Email is required")
      .min(15, "Email must be at least 15 characters long")
      .max(255, "Email must be at most 255 characters long")
      .test("isGmail", "Only Gmail addresses are allowed", (value) =>
        value.endsWith("@gmail.com")
      ),
    Password: yup
      .string()
      .required("Password is required")
      .min(5, "Password must be at least 5 characters long")
      .max(80, "Password must be at most 80 characters long"),
    Newpassword: yup
      .string()
      .oneOf([yup.ref("Password"), null], "Passwords must match")
      .required("Password confirmation is required")
      .min(5, "Password must be at least 5 characters long")
      .max(80, "Password must be at most 80 characters long")
});

export default function SignUp() {
    const navigate = useHistory();
    const {
      register,
      formState: { errors },
      handleSubmit,
      reset,
    } = useForm(
      { mode: "all", 
      resolver: yupResolver(schema),
      defaultValues: {  
        Username: "",
        Email: "",
        Role: "",
        Password: "",
        Newpassword: ""
      }, });
    const [Role, setRole] = React.useState("");
    const handleChangeR = (event) => {setRole(event.target.value)};
    const [showPassword, setShowPassword] = React.useState(false);
    const [progress, setProgress] = React.useState(10);
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = React.useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  
    const handleClickOpen = () => {setOpen(true);};
  
    const handleClose = () => {setOpen(false);};
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    
    const eventSubmit = (event) => {
        event.preventDefault();
        handleSubmit((data) => {
            delete data.Newpassword;
            loadingAnConnect(data);
        })();
    }

    const loadingAnConnect = async (data) => {
        setIsLoading(true);
        setProgress(0);
        try {
            try{
                const response = await axios.post('http://localhost:6929/cvs/SignUp/Create', data, {
                    headers: {
                        'content-Type': 'application/json',
                        'Accept-Version': '1.1.0'
                    },
                    onUploadProgress: (progressEvent) => {
                        const progress = (progressEvent.loaded / progressEvent.total) * 100;
                        setProgress(progress);
                    }
                });
               
            }catch(error){
                
                console.log(error.response.data.message);
            }
        } catch (error) {
          console.error(error);
        } finally {
            handleClickOpen()
            setIsLoading(false);
        //   setTimeout(() => {
        //     navigate("/SignIn");
        //   }, 1000);
        }
    };
    
    return (
        
        <ThemeProvider theme={defaultTheme}>
            {isLoading && (
                <div className="loading" style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 9999,
                }}>
                <CircularProgressWithLabel value={progress} />
                </div>
            )}
            <Grid container component="main" sx={{ height: '100vh' }}>
                <CssBaseline />
                <Grid
                item
                xs={false}
                sm={4}
                md={6}
                sx={{
                    backgroundImage: 'url(https://i.ibb.co/Ny3DHKj/campus-Vertical-Design.png)',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
                />
                <Grid item xs={12} sm={8} md={6} component={Paper} elevation={6} square>
                <Box
                    sx={{
                    my: 6,
                    mx: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: '#000087' }}>
                    <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                    Sign Up
                    </Typography>
                    <Box component="form" noValidate onSubmit={eventSubmit} sx={{ mt: 1 }} fullWidth style={{ width: '300px', height: '750px' }}>
                        <InputLabel id="Email-label">Email</InputLabel>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="Username"
                            label="Username"
                            name="Username"
                            {...register("Username")}
                            autoComplete="Username"
                            autoFocus
                        />
                        <Typography
                            sx={{
                                opacity: 0.9,
                                border: "2px solid #58BC8",
                                caretColor: "#b6003f",
                                color: "#b6003f",
                                display: "block",
                                textAlign: "center",
                                fontWeight: 700,
                                fontFamily: "monospace",
                            }}
                        >
                            {errors.Username?.message}
                        </Typography>
                        <InputLabel id="Email-label">Email</InputLabel>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="Email"
                            label="Email Address"
                            name="Email"
                            {...register("Email")}
                            autoComplete="Email"
                            autoFocus
                        />
                        <Typography
                            sx={{
                                opacity: 0.9,
                                border: "2px solid #58BC8",
                                caretColor: "#b6003f",
                                color: "#b6003f",
                                display: "block",
                                textAlign: "center",
                                fontWeight: 700,
                                fontFamily: "monospace",
                            }}
                        >
                            {errors.Email?.message}
                        </Typography>
                        <InputLabel id="RoleSelecter-label">Role</InputLabel>
                        <Select
                            {...register("Role")}
                            id="RoleSelecter"
                            value={Role}
                            fullWidth
                            labelId="RoleSelecter-label"
                            name="Role"
                            onChange={handleChangeR}
                            required 
                            autoFocus
                        >
                            <MenuItem value={"User"}>CasualUser</MenuItem>
                            <MenuItem value={"Company"}>Company</MenuItem>
                        </Select>
                        <InputLabel id="Password-label">Password</InputLabel>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="Password"
                            {...register("Password")}
                            label="Password"
                            type={showPassword ? "text" : "password"}
                            id="password"
                            autoComplete="current-password"
                        />
                        <Typography
                            sx={{
                                opacity: 0.9,
                                border: "2px solid #58BC8",
                                caretColor: "#b6003f",
                                color: "#b6003f",
                                display: "block",
                                textAlign: "center",
                                fontWeight: 700,
                                fontFamily: "monospace",
                            }}
                        >
                            {errors.Password?.message}
                        </Typography>
                        <InputLabel id="Newpassword-label">Confirm Password</InputLabel>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="Newpassword"
                            {...register("Newpassword")}
                            label="Confirm Password"
                            type={showPassword ? "text" : "password"}
                            id="Newpassword"
                            autoComplete="current-password"
                        />
                        <Typography
                            sx={{
                                opacity: 0.9,
                                border: "2px solid #58BC8",
                                caretColor: "#b6003f",
                                color: "#b6003f",
                                display: "block",
                                textAlign: "center",
                                fontWeight: 700,
                                fontFamily: "monospace",
                            }}
                        >
                            {errors.Newpassword?.message}
                        </Typography>
                        <FormControlLabel
                            control={<Checkbox value="remember" color="primary" onClick={handleClickShowPassword}/>}
                            label="Show passwords"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2, bgcolor: '#000087'}}
                        >
                            Sign Up
                        </Button>
                        <Grid container>
                            <Grid item xs>
                            <Link href="/RecoveryPassword" variant="body2" color={'#000087'}>
                                Forgot password?
                            </Link>
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item>
                            <Link href="/Sign In" variant="body2" color={'#000087'}>
                                {"Don't have an account? Sign Up"}
                            </Link>
                            </Grid>
                        </Grid>
                        <Copyright sx={{ mt: 5 }} />
                    </Box>
                </Box>
                </Grid>
            </Grid>
            <Dialog
                fullScreen={fullScreen}
                open={open}
                onClose={handleClose}
                aria-labelledby="endpoint-dialog-title"
            >
                <DialogTitle id="endpoint-dialog-title">
                {"Error found try again"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText className='ContentModal'>
                        
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button onClick={handleClose} autoFocus>
                    close
                </Button>
                </DialogActions>
            </Dialog>
        </ThemeProvider>
    );
}

export function CircularProgressWithLabel(props) {
    return (
      <Box sx={{ position: 'relative', display: 'inline-flex'}}>
        <CircularProgress variant="determinate"  size={200} {...props} />
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="caption" component="div" color="text.secondary"
          sx={{
            my: 4,
            opacity: 0.9,
            display: 'block',
            fontSize: "4rem",
            textAlign: "center",
            fontWeight: 700,
            fontFamily: 'monospace',
            color: '#f4e6ff'
            }} >
            {`${Math.round(props.value)}%`}
          </Typography>
        </Box>
      </Box>
    );
  }