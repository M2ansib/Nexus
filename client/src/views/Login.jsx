import React, { useState, useEffect } from 'react';
import Box from '@material-ui/core/Box';
import Card from '../Card';
import Paper from '@material-ui/core/Paper';
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

export default function LandingPageComponent() {
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
            <canvas id="gradient-canvas" data-js-darken-top data-transition-in style={{"width":"100%", height:"100%", position:"fixed"}}>
            {/* <!--
                Remove data-js-darken-top to keep the same brightness in the upper part of the canvas
            --> */}
            </canvas>
            <Box display="flex" justifyContent="center" alignItems="center" position="fixed" width="100vw" height="100vh">
                <Paper elevation={3} className="blur-behind" style={{"borderRadius":"8px", "backgroundColor":"rgba(55,55,55,0.75)", padding:"1em"}}>
                    <h1 className="drop-shadow" style={{"width":"100%", "textAlign":"center", paddingRight:".5em"}}>Welcome to Ascent LEAP!</h1>
                    <form className={classes.root} noValidate autoComplete="off">
                    <TextField id="outlined-basic" label="Username" variant="outlined" color="secondary" />
                    <br/>
                    <FormControl className={clsx(classes.margin, classes.textField)} variant="outlined">
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
                            labelWidth={70}
                        />
                        </FormControl>
                        <br/>
                        <ButtonGroup display="flex" justifyContent="center" alignItems="center" size="large" color="primary" aria-label="large outlined primary button group">
                            <Button>Sign In</Button>
                            <Button>Register</Button>
                            <Button>Three</Button>
                        </ButtonGroup>
                    </form>
                </Paper>
            </Box>
        </div>
    );
}