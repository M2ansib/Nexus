import React, { useRef, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { Button, ButtonGroup } from '@material-ui/core';
import Modal from '@material-ui/core/Modal';
import FormControl from '@material-ui/core/FormControl'
import Input from '@material-ui/core/Input'
import moment, { calendarFormat } from 'moment';

const useStyles = makeStyles((theme) => ({
    root: {
        // minWidth: 200,
        maxWidth: 345,
        width: "100%"
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    avatar: {
        backgroundColor: red[500],
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

export default function PairingCard(props) {
    const classes = useStyles()
    const { name, initials, school, subjects, remarks, email, cal } = props
    const [expanded, setExpanded] = React.useState(false);
    const [modalStyle] = React.useState(getModalStyle);
    const [open, setOpen] = useState(false)

    const inputAvatar = useRef()
    const joinButton = useRef()


    const joinClick = (e) => {
        e.preventDefault();
        enterChannel();
    }

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const createEvent = (e) => {
        e.preventDefault()
        let fd = new FormData()
        console.log(new Date(document.getElementById("endTime").value))
        fd.append("name", document.getElementById("summaryRef").value)
        fd.append("begin", moment(new Date(document.getElementById("startTime").value)).format("YYYY-MM-DD HH:MM:SS"))
        fd.append("end", moment(new Date(document.getElementById("endTime").value)).format("YYYY-MM-DD HH:MM:SS"))
        fd.append("attendees", ["ria.mundhra.2019@vjc.sg","test"])

        // fetch("/api/write_to_cal", {
        //     method: "POST",
        //     body: fd
        // }).then(res=>{
        //     cal?.refetchEvents()
        // })
    }

    return (
        <>
            <Card className={classes.root} elevation={5}>
                <CardHeader
                    avatar={
                        <Avatar ref={inputAvatar} aria-label="recipe" className={classes.avatar}>
                            {initials}
                        </Avatar>
                    }
                    title={name}
                />
                <CardContent>
                    <Typography variant="body2" color="textSecondary" component="p">
                        School: {school}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                        Subjects Offered: {subjects}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                        Remarks: {remarks}
                    </Typography>
                </CardContent>
                <CardActions disableSpacing>
                    <IconButton
                        className={clsx(classes.expand, {
                            [classes.expandOpen]: expanded,
                        })}
                        onClick={handleExpandClick}
                        aria-expanded={expanded}
                        aria-label="show more"
                    >
                        <ExpandMoreIcon />
                    </IconButton>
                </CardActions>
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <CardContent>
                        <ButtonGroup fullWidth='true' orientation="vertical" display="flex" justifyContent="center" alignItems="center" size="large" color="primary" aria-label="large outlined primary button group">
                            <Button onClick={() => { setOpen(open => !open) }}>Schedule Appointment</Button>
                            <Button className="join" ref={joinButton} onClick={joinClick}>Message</Button>
                            <Button>Unpair</Button>
                            <Button>Report</Button>
                        </ButtonGroup>
                    </CardContent>
                </Collapse>
            </Card>
            <Modal
                open={open}
                onClose={() => { setOpen(open => !open) }}
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
                            <Input id="startTime" aria-describedby="my-helper-text" placeholder="start time" type="datetime-local" />
                        </FormControl>
                        <FormControl style={{ width: 350 }}>
                            <Input id="endTime" aria-describedby="my-helper-text" placeholder="end time" type="datetime-local" />
                        </FormControl>
                        <Button type="submit">Confirm</Button>
                    </form>
                </div>
            </Modal>
        </>
    );
}
