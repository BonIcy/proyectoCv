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
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
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
let schema = yup.object().shape({
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
        Newpassword: "",
        Company: "",
        Address: "",
        Phone: "",
        Country: "",
        City: "",
        Description: "",
        legalRep_Name: "",
        legalRep_identificationNumber: 0
      }, });
    const [Role, setRole] = React.useState("");
    const handleChangeR = (event) => {
        setRole(event.target.value);
        switch (event.target.value) {
            case 'Company':
                setIsCompany(true);
                break;
        
            default:
                setIsCompany(false);
                break;
        }
    };
    const [showPassword, setShowPassword] = React.useState(false);
    const [progress, setProgress] = React.useState(10);
    const [isLoading, setIsLoading] = useState(false);
    const [isCompany, setIsCompany] = useState(false);
    const [open, setOpen] = React.useState(false);
    const [okRes, setOkRes] = React.useState(false);
    const [textError, setTextError] = React.useState('');
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
    //validation System
    if (!isCompany) {
        schema = yup.object().shape({
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
        
    }else {
        schema = yup.object().shape({
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
              .max(80, "Password must be at most 80 characters long"),
            Company: yup
              .string()
              .required("Company is required")
              .min(3, "Company must be at least 3 characters long")
              .max(80, "Company must be at most 100 characters long"),
            Address: yup
              .string()
              .required("Address is required")
              .min(3, "Address must be at least 3 characters long")
              .max(255, "Address must be at most 255 characters long"),
            Phone: yup
              .string()
              .required("Phone is required")
              .min(4, "Phone must be at least 4 characters long")
              .max(20, "Phone must be at most 20 characters long")
              .matches(
                /^\+\d{1,20}$/,
                "The Phone number must be a sequence of numbers with the prefix according to the country. example: +57XXXXXXXX"),
            Country: yup
                .string()
                .required("Country is required")
                .min(3, "Country must be at least 3 characters long")
                .max(60, "Country must be at most 60 characters long")
                .matches(
                  /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ ,.\s'"!?-]+$/,
                  "Country must be a text without special characters"),
            City: yup
                .string()
                .required("City is required")
                .min(3, "City must be at least 3 characters long")
                .max(60, "City must be at most 60 characters long")
                .matches(
                  /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ ,.\s'"!?-]+$/,
                  "City must be a text without special characters"),
            Description: yup
                  .string()
                  .required("Description is required")
                  .min(3, "Description must be at least 3 characters long")
                  .max(600, "Description must be at most 600 characters long")
                  .matches(
                    /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ ,.\s'"!?-]+$/,
                    "Description must be a text without special characters"),
            legalRep_Name: yup
                .string()
                .required("Name Of The Legal Representative is required")
                .min(3, "Name Of The Legal Representative must be at least 3 characters long")
                .max(60, "Name Of The Legal Representative must be at most 60 characters long")
                .matches(
                  /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ ,.\s'"!?-]+$/,
                  "Name Of The Legal Representative must be a text without special characters"),
            legalRep_identificationNumber: yup
                .number("Identification Number Of The Legal Representative must be a Number")
                .positive("Identification Number Of The Legal Representative must be a positive number")
                .integer("Identification Number Of The Legal Representative must be an integer")
                .required("Identification Number Of The Legal Representative is required")
        });
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
                switch (response.statusText) {
                    case "OK":
                        setOkRes(true);
                        setTimeout(() => {
                            setOkRes(false);
                            navigate.push("/SignIn");
                        }, 3000);
                        break;
                
                    default:
                        break;
                }
            }catch(error){
                handleClickOpen();
                let errorData = error.response.data;
                let errorValidate = errorData.keyValue;
                setTextError(error.response.data.message ? error.response.data.message : `The ${Object.keys(errorValidate)[0]}: ${errorValidate.Email} is already registered, try another one.`);
            }
        } catch (error) {
          console.error(error);
        } finally {
            setIsLoading(false);
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
                    <Box component="form" noValidate onSubmit={eventSubmit} sx={{ mt: 1 }} fullWidth style={{ width: '300px', height: isCompany ? '1600px' : '750px', }}>
                        <InputLabel id="Email-label">Username</InputLabel>
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
                         {isCompany && (
                            <>
                                <Typography component="h1" variant="h5" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                Company Information
                                </Typography>
                                <TextField
                                margin="normal"
                                fullWidth
                                required
                                id="Company"
                                label="Company Name"
                                name="Company"
                                {...register("Company")}
                                autoComplete="Company"
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
                                    {errors.Company?.message}
                                </Typography>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="Address"
                                    label="Company Address"
                                    name="Address"
                                    {...register("Address")}
                                    autoComplete="Address"
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
                                    {errors.Address?.message}
                                </Typography>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="Phone"
                                    label="Company Phone"
                                    name="Phone"
                                    {...register("Phone")}
                                    autoComplete="Phone"
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
                                    {errors.Phone?.message}
                                </Typography>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="Country"
                                    label="Company Country"
                                    name="Country"
                                    {...register("Country")}
                                    autoComplete="Country"
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
                                    {errors.Country?.message}
                                </Typography>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="City"
                                    label="Company City"
                                    name="City"
                                    {...register("City")}
                                    autoComplete="City"
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
                                    {errors.City?.message}
                                </Typography>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="Description"
                                    label="Company Description"
                                    name="Description"
                                    multiline
                                    rows={4}
                                    {...register("Description")}
                                    autoComplete="Description"
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
                                    {errors.Description?.message}
                                </Typography>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="legalRep_Name"
                                    label="Name Of The Legal Representative"
                                    name="legalRep_Name"
                                    {...register("legalRep_Name")}
                                    autoComplete="legalRep_Name"
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
                                    {errors.legalRep_Name?.message}
                                </Typography>
                                <TextField
                                    margin="normal"
                                    required
                                    type='number'
                                    fullWidth
                                    id="legalRep_identificationNumber"
                                    label="Identification Number Of The Legal Representative"
                                    name="legalRep_identificationNumber"
                                    inputProps={{ inputMode: "numeric" }}
                                    {...register("legalRep_identificationNumber")}
                                    autoComplete="legalRep_identificationNumber"
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
                                    {errors.legalRep_identificationNumber?.message}
                                </Typography>
                          </>
                        )}
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
                            <Link href="/SignIn" variant="body2" color={'#000087'}>
                                {"Have an account? Sign In"}
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
                    <DialogContentText>
                        {textError}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button onClick={handleClose} autoFocus>
                    close
                </Button>
                </DialogActions>
            </Dialog>
            {okRes && (
                <Stack sx={{ width: '100%' }} spacing={2} style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
              
                    justifyContent: 'end',
                    zIndex: 9999,
                }}>
                    <Alert severity="success">The user was created correctly, remember your username and password!</Alert>
                </Stack>
            )}
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