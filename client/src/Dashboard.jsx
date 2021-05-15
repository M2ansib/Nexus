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
                    <Card />
                </Box>
                <Box mx="2rem" py="2rem">
                    <Card />
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
                        <h1 style={{ textAlign: "center" }}>Howdy (name), welcome to Ascademy!</h1>
                        <iframe src="https://calendar.google.com/calendar/embed?src=ria.mundhra1234%40gmail.com&ctz=Asia%2FSingapore" style={{ border: 0, width: 800, height: 600, frameBorder: 0 }}></iframe>
                    </Box>
                </Grid>
            </Grid>

        </div>
    )
}