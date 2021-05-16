import React, { useEffect, useState } from 'react';
import Box from '@material-ui/core/Box';
import Card from './Card';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Drawer from '@material-ui/core/Drawer';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';
import { Toolbar } from '@material-ui/core';


const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
            width: '50ch',
        },
    },
}));

function PairingsList() {
    const classes = useStyles();
    const [currentTime, setCurrentTime] = useState(0);
    useEffect(() => {
        fetch('/api/time').then(res => res.json()).then(data => {
            setCurrentTime(data.time);
        });
    }, []);
    return (
        <React.Fragment>
            <Drawer
                className={classes.drawer}
                variant="permanent"
                classes={{
                    paper: classes.drawerPaper,
                }}
                anchor="left"
                style={{zIndex:1}}
            >
                <div className={classes.toolbar} />
                <Toolbar/>
                <Box mx="2rem" py="2rem">
                    <Card name="Amish Venkat" initials="AV" school="VJC" subjects="H1 General Paper" remarks="Please bring questions before hand and be punctual. Thanks."/>
                </Box>
                <Box mx="2rem" py="2rem">
                    <Card name="Chien Hao" initials="CH"school="RI" subjects="H2 Economics and H1 General Paper" remarks="Free only on weekends"/>
                </Box>
            </Drawer>
        </React.Fragment>
    );
}


export default function DashboardCards() {


    return (
        <div>
            <Grid container spacing={3}>
                <Grid container item xs={3} spacing={0}>
                    <PairingsList />
                </Grid>
                <Grid container item xs={9} spacing={0} justify="center" alignItems="flex-start">
                    <Box mx="2rem" py="2rem">
                        <h1 style={{ textAlign: "center" }}>Howdy Ria, welcome to Ascademy!</h1>
                        <br/>
                        <h2 style={{ textAlign: "center" }}>Scheduled Appointments</h2>
                        <iframe src="https://calendar.google.com/calendar/embed?src=ria.mundhra1234%40gmail.com&ctz=Asia%2FSingapore" style={{ border: 0, width: 800, height: 600, frameBorder: 0 }}></iframe>
                    </Box>
                </Grid>
            </Grid>

        </div>
    )
}