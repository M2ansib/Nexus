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
import {motion} from 'framer-motion';

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

    useEffect(() => {
        fetch('/api/time').then(res => res.json()).then(data => {
            setCurrentTime(data.time);
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

            <MosaicContainer>
                <Card name="Amish Venkat" initials="AV" school="VJC" subjects="H1 General Paper" remarks="Please bring questions before hand and be punctual. Thanks." cal={cal} email="av@gmail.com" />
                <Card name="Chien Hao" initials="CH" school="RI" subjects="H2 Economics and H1 General Paper" remarks="Free only on weekends" cal={cal} email="tch@gmail.com" />
                <Card name="Amish Venkat" initials="AV" school="VJC" subjects="H1 General Paper" remarks="Please bring questions before hand and be punctual. Thanks." cal={cal} email="av@gmail.com" />
                <Card name="Chien Hao" initials="CH" school="RI" subjects="H2 Economics and H1 General Paper" remarks="Free only on weekends" cal={cal} email="tch@gmail.com" />
                <Card name="Amish Venkat" initials="AV" school="VJC" subjects="H1 General Paper" remarks="Please bring questions before hand and be punctual. Thanks." cal={cal} email="av@gmail.com" />
                <Card name="Chien Hao" initials="CH" school="RI" subjects="H2 Economics and H1 General Paper" remarks="Free only on weekends" cal={cal} email="tch@gmail.com" />
                <Card name="Amish Venkat" initials="AV" school="VJC" subjects="H1 General Paper" remarks="Please bring questions before hand and be punctual. Thanks." cal={cal} email="av@gmail.com" />
                <Card name="Chien Hao" initials="CH" school="RI" subjects="H2 Economics and H1 General Paper" remarks="Free only on weekends" cal={cal} email="tch@gmail.com" />
                <Card name="Amish Venkat" initials="AV" school="VJC" subjects="H1 General Paper" remarks="Please bring questions before hand and be punctual. Thanks." cal={cal} email="av@gmail.com" />
                <Card name="Chien Hao" initials="CH" school="RI" subjects="H2 Economics and H1 General Paper" remarks="Free only on weekends" cal={cal} email="tch@gmail.com" />
                <Card name="Amish Venkat" initials="AV" school="VJC" subjects="H1 General Paper" remarks="Please bring questions before hand and be punctual. Thanks." cal={cal} email="av@gmail.com" />
                <Card name="Chien Hao" initials="CH" school="RI" subjects="H2 Economics and H1 General Paper" remarks="Free only on weekends" cal={cal} email="tch@gmail.com" />
            </MosaicContainer>
        </div>
        </motion.div>
    );
}

export default function Groupings() {
    const handleClick = () => {
        setOpen(open => !open);
    };

    return (

        <Grid xs={12} justify="flex-start" alignItems="flex-start">
            <PairingsList handleClick={handleClick} />
        </Grid>
    )
}