import React from 'react'
import CancelIcon from '@material-ui/icons/Cancel'
import IconButton from '@material-ui/core/IconButton'
import Grid from '@material-ui/core/Grid';
import { Link } from "react-router-dom"

export default function Chat() {
    return (
        <Grid container alignItems="center" justify="center" style={{backgroundColor:"darkseagreen", height:"100vh"}}>
            <div>chat ui</div>
            <IconButton aria-label="close" color="inherit" component={Link} to="/dash">
                <CancelIcon />
            </IconButton>
        </Grid>
    )
}