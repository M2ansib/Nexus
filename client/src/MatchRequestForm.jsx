import React, { useState, useEffect } from 'react';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
// import { makeStyles } from '@material-ui/core/styles';
// import TextField from '@material-ui/core/TextField';

import "./views/Login.css";
import clsx from 'clsx';
import Grid from '@material-ui/core/Grid';
import LockOpenRoundedIcon from '@material-ui/icons/LockOpenRounded';
import AddCircleRoundedIcon from '@material-ui/icons/AddCircleRounded';
import InfoRoundedIcon from '@material-ui/icons/InfoRounded';

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
import Autocomplete from '@material-ui/lab/Autocomplete';

import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import { AnimatePresence, motion } from 'framer-motion';

import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/CreateTwoTone';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
            width: '35ch',
        },
    },
    fab: {
        zIndex: 100,
        position: 'absolute',
        bottom: theme.spacing(2),
        right: theme.spacing(2),
        fontWeight: 500
    },
    extendedIcon: {
        marginRight: theme.spacing(1),
    }
}));

export default function LandingPageComponent() {
    const classes = useStyles();
    const [currentTime, setCurrentTime] = useState(0);
    const [values, setValues] = React.useState({
        selectedPreferences: [],
        preferences: ['list', 'of', 'test', 'here'],
        remarks: ''
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
        fetch("/api/fetch/preferences").then(res=>res.json()).then(data=>
            setValues({
                selectedPreferences: [],
                preferences: data.data,
                remarks: ''
            })
        )
        fetch('/api/time').then(res => res.json()).then(data => {
            setCurrentTime(data.time);
        });
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(values)
        fetch("/api/create/match_request", {
            method: 'POST',
            body: JSON.stringify(values)
        }).then(res => res.json()).then(data => window.location.href="/dash")
    }

    return (
        <AnimatePresence exitBeforeEnter>
            <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scaleY: 0, opacity: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div>
                    {/* <canvas id="gradient-canvas" data-js-darken-top data-transition-in style={{"width":"100%", height:"100%", position:"fixed"}}>
            </canvas> */}

                    <Box display="flex" justifyContent="center" alignItems="center" position="fixed" width="100vw" height="100vh">
                        <Paper elevation={3} className="blur-behind" style={{ "borderRadius": "8px", "backgroundColor": "rgba(200,200,200,0.75)", padding: "1em" }}>
                            <h1 className="drop-shadow" style={{ "width": "100%", "textAlign": "center", overflowX: 'hidden' }}>Create a match request</h1>
                            <form className={classes.root} noValidate autoComplete="off" onSubmit={handleSubmit}>
                                <Autocomplete
                                    multiple
                                    id="combo-box-school-choices"
                                    options={values.preferences}
                                    freeSolo={true}
                                    required
                                    getOptionLabel={(option) => option}
                                    style={{ width: "100%" }}
                                    onChange={(event, value) => setValues({ ...values, ["selectedPreferences"]: value })}
                                    renderInput={(params) => <TextField {...params} label="Preferences" variant="outlined" />}
                                />
                                <TextField id="outlined-basic" required label="Remarks" variant="outlined" width="100%" color="secondary" onChange={handleChange("remarks")} />
                                <Box display="flex" justifyContent="center" alignItems="center">
                                    <ButtonGroup size="large" aria-label="large outlined primary button group" style={{ "overflowX": "hidden" }}>
                                        <Button type="submit">
                                            <Grid container spacing={1} display="flex" justifyContent="center" alignItems="center">
                                                <Grid item style={{ display: "flex" }}>
                                                    <LockOpenRoundedIcon />
                                                </Grid>
                                                <Grid item>
                                                    Send Match request
                                    </Grid>
                                            </Grid>
                                        </Button>
                                    </ButtonGroup>
                                </Box>
                            </form>
                        </Paper>
                    </Box>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}