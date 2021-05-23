import React, { useState, useEffect } from 'react';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';

import "./Login.css";
import clsx from 'clsx';
import Grid from '@material-ui/core/Grid';
import LockOpenRoundedIcon from '@material-ui/icons/LockOpenRounded';

import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
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
        width: '35ch',
      },
    },
  }));

export default function LandingPageComponent() {
    const classes = useStyles();
    const [currentTime, setCurrentTime] = useState(0);
    const [values, setValues] = React.useState({
        name: '',
        email: '',
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
            <canvas id="gradient-canvas" data-js-darken-top data-transition-in style={{"width":"100%", height:"100%", position:"fixed"}}>
            {/* <!--
                Remove data-js-darken-top to keep the same brightness in the upper part of the canvas
            --> */}
            </canvas>
            <Box display="flex" justifyContent="center" alignItems="center" position="fixed" width="100vw" height="100vh">
                <Paper elevation={3} className="blur-behind" style={{"borderRadius":"8px", "backgroundColor": "rgba(200,200,200,0.75)", padding:"1em"}}>
                    <h1 className="drop-shadow" style={{"width":"100%", "textAlign":"center", paddingRight:".5em", overflowX:'hidden'}}>Welcome to Ascademy!</h1>
                    <form className={classes.root} noValidate autoComplete="off">
                    <TextField id="outlined-basic" required label="ID" variant="outlined" width="100%" color="secondary" />
                    <br/>
                    <FormControl required className={clsx(classes.margin, classes.textField)} variant="outlined">
                        <InputLabel>Name</InputLabel>
                        <OutlinedInput
                            type="text"
                            value={values.name}
                            onChange={handleChange('name')}
                            endAdornment={
                            }
                            labelWidth={80}
                        />
                    </FormControl>
                    <FormControl required className={clsx(classes.margin, classes.textField)} variant="outlined">
                        <InputLabel>Email</InputLabel>
                        <OutlinedInput
                            type="text"
                            value={values.email}
                            onChange={handleChange('email')}
                            endAdornment={
                            }
                            labelWidth={80}
                        />
                    </FormControl>
                    <FormControl required className={clsx(classes.margin, classes.textField)} variant="outlined">
                        <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
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
                            labelWidth={80}
                        />
                        </FormControl>
                        <br/>
                        <Box display="flex" justifyContent="center" alignItems="center">
                            <ButtonGroup size="large" aria-label="large outlined primary button group" style={{"overflowX":"hidden"}}>
                                <Button>
                                <Grid container spacing={1} display="flex" justifyContent="center" alignItems="center">
                                    <Grid item style={{display:"flex"}}>
                                        <LockOpenRoundedIcon />
                                    </Grid>
                                    <Grid item>
                                        Register
                                    </Grid>
                                </Grid>
                                </Button>
                            </ButtonGroup>
                        </Box>
                    </form>
                </Paper>
            </Box>
        </div>
    );
}