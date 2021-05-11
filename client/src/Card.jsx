import React from 'react';
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

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
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

export default function RecipeReviewCard() {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card className={classes.root} elevation={5}>
      <CardHeader
        avatar={
          <Avatar aria-label="recipe" className={classes.avatar}>
            XT
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title="Morbi commodo mauris eu."
        subheader="September 14, 2016"
      />
      <CardMedia
        className={classes.media}
        image="/static/images/cards/paella.jpg"
        title="Aliquam venenatis"
      />
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
        Etiam sagittis elementum mi, in sagittis nulla consectetur eget.
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
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
          <Typography paragraph>Method:</Typography>
          <Typography paragraph>
            Donec orci est, venenatis sed faucibus quis, suscipit faucibus augue. 
            Nullam in neque quis mi lobortis blandit euismod a lectus.
          </Typography>
          <Typography paragraph>
            Fusce at urna semper, facilisis orci eget, lacinia est. 
            Cras sed odio in turpis eleifend ullamcorper et sit amet enim. 
            Donec convallis dolor at metus tempus, id rutrum eros iaculis. Mauris sed odio dolor. 
            Duis dictum augue pretium dolor euismod, sed mollis turpis volutpat. 
            Sed elementum mi libero, at venenatis dolor dignissim ac. 
            Proin in quam mauris.
          </Typography>
          <Typography paragraph>
            Morbi eu pretium quam. 
            Sed aliquet dapibus venenatis. 
            Duis id hendrerit mi. 
            Etiam ornare urna nec dui vehicula suscipit.
          </Typography>
          <Typography>
            Ut nec nisi risus.
          </Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
}
