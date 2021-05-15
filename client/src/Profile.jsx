import React, { useState, useEffect } from 'react';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
// import { makeStyles } from '@material-ui/core/styles';
// import TextField from '@material-ui/core/TextField';

import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import FilledInput from '@material-ui/core/FilledInput';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
            width: '50ch',
        },
    },
}));

export default function Profile() {
    const classes = useStyles();
    const [currentTime, setCurrentTime] = useState(0);
    const [values, setValues] = React.useState({
        password: '',
        showPassword: false,
    });

    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
    };

    const handleClickShowPassword = () => {
        setValues({ ...values, showPassword: !values.showPassword });
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    useEffect(() => {
        fetch('/api/time').then(res => res.json()).then(data => {
            setCurrentTime(data.time);
        });
        var gradient = new Gradient();
        gradient.initGradient("#gradient-canvas");
    }, []);

    return (
        <div>
            {/* <Box mx="2rem" py="2rem">
                <p>{currentTime}</p>
                <Card/>
            </Box> */}
            <canvas id="gradient-canvas" data-js-darken-top data-transition-in style={{ "width": "100%", height: "100%", position: "fixed", color:"white" }}>
                {/* <!--
                Remove data-js-darken-top to keep the same brightness in the upper part of the canvas
            --> */}
            </canvas>
            <Box display="flex" justifyContent="center" alignItems="center" position="fixed" width="100vw" height="100vh" flexDirection="column">
                <Paper elevation={3} className="blur-behind" style={{ "borderRadius": "8px", "backgroundColor": "rgba(200,200,200,0.75)", padding: "1em" }}>
                    <form className={classes.root} noValidate autoComplete="off" display="flex" flexDirection="row">
                        <br />
                        <InputLabel htmlFor="outlined-basic">Email</InputLabel>
                        <TextField id="outlined-basic" disabled='true' label="email@gmail.com" variant="outlined" color="secondary" width='100%' />
                        <InputLabel htmlFor="outlined-update-email">Change Email</InputLabel>
                        <TextField id="outlined-update-email" variant="outlined" color="secondary" />

                            <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-password"
                                type={values.showPassword ? 'text' : 'password'}
                                value="default password"
                                disabled="true"
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                        >
                                            {values.showPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                labelWidth={70}
                            />
                            <InputLabel htmlFor="outlined-adornment-password">Change Password</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-password"
                                type={values.showPassword ? 'text' : 'password'}
                                value={values.password}
                                onChange={handleChange('password')}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                        >
                                            {values.showPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                labelWidth={70}
                            />
                            <InputLabel htmlFor="outlined-adornment-password">Confirm New Password</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-password"
                                type={values.showPassword ? 'text' : 'password'}
                                value={values.password}
                                onChange={handleChange('password')}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                        >
                                            {values.showPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                labelWidth={70}
                            />
                        
                        <br />
                        <ButtonGroup display="flex" justifyContent="center" alignItems="center" size="large" color="primary" aria-label="large outlined primary button group">
                            <Button>Update Profile</Button>
                        </ButtonGroup>
                    </form>
                </Paper>
            </Box>
        </div>
    )
}