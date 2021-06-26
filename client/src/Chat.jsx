import React from 'react'
import CancelIcon from '@material-ui/icons/Cancel'
import IconButton from '@material-ui/core/IconButton'
import Grid from '@material-ui/core/Grid';
import { Link } from "react-router-dom"
import { motion } from 'framer-motion';

export default function Chat() {

    const variants = {
        initial: { opacity: 0, y: "-100vh" },
        open: { opacity: [0, 1, 1], y: ["-100vh", "0vh", "0vh"] },
        closed: { opacity: [1, 1, 0], y: ["0vh", "-100vh", "-100vh"] },
    }
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Grid container alignItems="center" justify="center" style={{height: "100vh" }}>
                <iframe src="http://localhost:3000/" style={{width:"100%", height:"95%"}}></iframe>
                <IconButton aria-label="close" color="inherit" component={Link} to="/dash">
                    <CancelIcon />
                </IconButton>
            </Grid>
        </motion.div>
    )
}