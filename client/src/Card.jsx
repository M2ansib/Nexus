import React, { useRef } from 'react';
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

const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: 345,
        width: 345
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
}));

export default function PairingCard(props) {
    const classes=useStyles()
    const {name, initials, school, subjects, remarks, handleClick } = props
    const [expanded, setExpanded] = React.useState(false);

    const inputAvatar = useRef()
    const joinButton = useRef()


    const joinClick = (e) => {
        e.preventDefault();
        enterChannel();
    }

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    return (
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
                        <Button onClick={handleClick}>Schedule Appointment</Button>
                        <Button className="join" ref={joinButton} onClick={joinClick}>Message</Button>
                        <Button>Unpair</Button>
                        <Button>Report</Button>
                    </ButtonGroup>
                </CardContent>
            </Collapse>
        </Card>
    );
}
