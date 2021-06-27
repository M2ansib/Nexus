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
import MosaicContainer from './MosaicContainer';
import { motion } from 'framer-motion';
// import {enqueueSnackbar} from './App';

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
function PairingsList(props) {
    const { cal } = props
    const classes = useStyles();
    const [modalStyle] = React.useState(getModalStyle);
    const [currentTime, setCurrentTime] = useState(0);
    const [pairings, setPairings] = useState([
        {
            name: "Amish Venkat",
            initials: "AV",
            preferences: "Chess",
            remarks: "Not available on Wednesdays",
            cal: cal,
            email: "av@gmail.com"
        },
        {
            name: " Tan Chien Hao",
            initials: "TCH",
            preferences: "Cafe-hopping, Experimental Learning",
            remarks: "Free only on weekends",
            cal: cal,
            email: "tch@gmail.com"
        },
        {
            name: "Amish Venkat",
            initials: "AV",
            preferences: "Chess",
            remarks: "Not available on Wednesdays",
            cal: cal,
            email: "av@gmail.com"
        },
        {
            name: " Tan Chien Hao",
            initials: "TCH",
            preferences: "Cafe-hopping, Experimental Learning",
            remarks: "Free only on weekends",
            cal: cal,
            email: "tch@gmail.com"
        },
        {
            name: "Amish Venkat",
            initials: "AV",
            preferences: "Chess",
            remarks: "Not available on Wednesdays",
            cal: cal,
            email: "av@gmail.com"
        },
        {
            name: " Tan Chien Hao",
            initials: "TCH",
            preferences: "Cafe-hopping, Experimental Learning",
            remarks: "Free only on weekends",
            cal: cal,
            email: "tch@gmail.com"
        }
    ])

    const variants = {
        initial: { opacity: 0 },
        open: { opacity: 1 },
        closed: { opacity: 0 },
    }

    const blogVariants = {
        enter: { transition: { staggerChildren: 0.04 } },
        exit: { transition: { staggerChildren: 0.02 } }
    };

    useEffect(() => {
        fetch('/api/fetch/match_requests').then(res => res.json()).then(data => {
            setPairings(data.requests.map(x=>Object.create({
                name: x.name,
                initials: x.initials,
                preferences: x.preferences,
                remarks: x.remarks,
                cal: cal,
                email: x.email
            })))
        });
    }, []);
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className={classes.paper}>
                <motion.div
                    className="blog-list"
                    initial="initial"
                    animate="enter"
                    exit="exit"
                    variants={blogVariants}
                >

                    <MosaicContainer>
                        {pairings.map((pairing, index) => (
                            <Card key={index} name={pairing.name} setPairings={setPairings} initials={pairing.initials} preferences={pairing.preferences} remarks={pairing.remarks} cal={pairing.cal} email={pairing.email} index={index}/>
                        ))}
                    </MosaicContainer>
                </motion.div>
            </div>
        </motion.div>
    );
}

export default function Groupings() {

    return (

        <Grid xs={12} justify="flex-start" alignItems="flex-start">
            <PairingsList />
        </Grid>
    )
}