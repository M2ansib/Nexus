import React, { useEffect, useState, useRef } from 'react';
import clsx from 'clsx';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Card from './Card';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import Modal from '@material-ui/core/Modal';
import FormControl from '@material-ui/core/FormControl'
import Input from '@material-ui/core/Input'
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';
import { Toolbar } from '@material-ui/core';
import Calendar from "@ericz1803/react-google-calendar";
import ApiCalendar from 'react-google-calendar-api';


const API_KEY = "AIzaSyAh5r_-OWMGjDBaPv3QOc9Yl1yUBvYyL2E";

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
            width: '50ch',
        },
    },
    paper: {
        padding: 10,
    },
    modal: {
        position: 'absolute',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: 10,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
    }
}));

function getModalStyle() {
    const top = 50;
    const left = 50;

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}

const calStyles = {
    //you can use object styles (no import required)
    calendar: {
        borderWidth: "3px", //make outer edge of calendar thicker
        minWidth: 400
    },

    //you can also use emotion's string styles
    today: {
        color: "blue",
        border: "1px solid blue"
    }
}

function PairingsList(props) {
    const { handleClick } = props
    const classes = useStyles();
    const [modalStyle] = React.useState(getModalStyle);
    const [currentTime, setCurrentTime] = useState(0);

    useEffect(() => {
        fetch('/api/time').then(res => res.json()).then(data => {
            setCurrentTime(data.time);
        });
    }, []);
    return (
        <div className={classes.paper} style={{ height: window.innerHeight - 64, overflowY: "scroll" }}>
            {/* <Drawer
                className={classes.drawer}
                variant="persistent"
                open={true}
                classes={{
                    paper: classes.drawerPaper,
                }}
                anchor="left"
                style={{ zIndex: 1 }}
            > */}
            {/* <div className={classes.toolbar} /> */}
            {/* <Toolbar /> */}
            <Box py="2rem">
                <Card name="Amish Venkat" initials="AV" school="VJC" subjects="H1 General Paper" remarks="Please bring questions before hand and be punctual. Thanks." handleClick={handleClick} email="av@gmail.com" />
            </Box>
            <Box py="2rem">
                <Card name="Chien Hao" initials="CH" school="RI" subjects="H2 Economics and H1 General Paper" remarks="Free only on weekends" handleClick={handleClick} email="tch@gmail.com" />
            </Box>
            {/* </Drawer> */}
        </div>
    );
}


export default function DashboardCards() {
    const [calendars, setCalendars] = useState([
        { calendarId: ApiCalendar.calendar, signedIn: false },
    ]);
    const [open, setOpen] = React.useState(false);
    const classes = useStyles();
    const [modalStyle] = React.useState(getModalStyle);
    const [sign, setSign] = useState()

    const updateSign = (sign) => {
        setSign(sign)
    }
    useEffect(() => {
        ApiCalendar.onLoad(() => {
            setSign(ApiCalendar.getSignInStatus())
            ApiCalendar.listenSign(function (val) {
                updateSign(val)
            })
        })
    }, [])

    const handleClick = () => {
        setOpen(open => !open);
    };

    const handleItemClick = (e, name) => {
        if (name === 'sign-in') {
            ApiCalendar.handleAuthClick();
        } else if (name === 'sign-out') {
            ApiCalendar.handleSignoutClick();
        }
    }

    const createEvent = (e) => {
        e.preventDefault()

        const event = {
            summary: document.getElementById("summaryRef").value,
            end: { dateTime: new Date(document.getElementById("endTime").value) },
            start: { dateTime: new Date(document.getElementById("startTime").value) },
            description: document.getElementById("descriptionRef").value,
            attendees: [
                { 'email': "ria.mundhra.2019@vjc.sg" },
            ]

        };
        ApiCalendar.createEvent(event)
            .then((result) => {
                window.location.reload()
                handleClick()
            })
            .catch((error) => {
                console.log(error);
                alert("unable to create event")
            });
    }

    return (
        <div style={{ padding: 20 }}>
            <Grid
                container
                direction="row"
                ref={(el) => {
                    if (el) {
                        el.style.setProperty('align-items', "center", 'important');
                        el.style.setProperty('justify-content', "center", 'important');
                    }
                }}
                style={{ paddingLeft: 15, paddingRight: 15 }}
                spacing={3}
            >
                <Grid xs={12} sm={5} md={3} justify="flex-start" alignItems="flex-start">
                    <PairingsList handleClick={handleClick} />
                </Grid>
                <Grid item xs={12} sm={6} md={9} justify="center" alignItems="flex-start" style={{ height: window.innerHeight - 64, overflowY: "scroll" }} >
                    {/* <main className={classes.contentShift}> */}
                    <Box>
                        <h1 style={{ textAlign: "center" }}>Howdy Ria, welcome to Ascademy!</h1>
                        <br />
                        <h2 style={{ textAlign: "center" }}>Scheduled Appointments</h2>
                        <Button onClick={(e) => handleItemClick(e, 'sign-in')} >sign-in</Button>
                        <Modal
                            open={open}
                            onClose={handleClick}
                            aria-labelledby="simple-modal-title"
                            aria-describedby="simple-modal-description"
                        >
                            <div style={modalStyle} className={classes.modal}>
                                <h2>Event Details</h2>
                                <form onSubmit={createEvent} style={{ display: 'flex', flexDirection: "column", alignItems: "center" }}>
                                    <FormControl style={{ width: 350 }}>
                                        <Input id="summaryRef" aria-describedby="my-helper-text" placeholder="event title" />
                                    </FormControl>
                                    <FormControl style={{ width: 350 }}>
                                        <Input id="descriptionRef" aria-describedby="my-helper-text" placeholder="event description" />
                                    </FormControl>
                                    <FormControl style={{ width: 350 }}>
                                        <Input id="startTime" aria-describedby="my-helper-text" placeholder="start time" type="datetime-local" />
                                    </FormControl>
                                    <FormControl style={{ width: 350 }}>
                                        <Input id="endTime" aria-describedby="my-helper-text" placeholder="end time" type="datetime-local" />
                                    </FormControl>
                                    <Button type="submit">Confirm</Button>
                                </form>
                            </div>
                        </Modal>
                        <Button onClick={(e) => handleItemClick(e, 'sign-out')}>sign-out</Button>
                        {sign ? (
                            <Calendar apiKey={API_KEY} calendars={calendars} styles={calStyles} />
                        ) : null}
                    </Box>
                    {/* </main> */}
                </Grid>
            </Grid>
        </div>
    )
}