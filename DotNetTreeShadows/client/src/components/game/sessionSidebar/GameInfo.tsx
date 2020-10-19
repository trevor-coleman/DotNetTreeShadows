import React, {FunctionComponent, useState} from 'react';
import {useDispatch} from 'react-redux';
import {makeStyles, Theme} from '@material-ui/core/styles';
import {useTypedSelector} from "../../../store";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import {Collapse, Paper} from "@material-ui/core";
import {gameOptionDescriptions} from "./HostOptions";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import CheckIcon from '@material-ui/icons/Check';
import NotInterestedIcon from '@material-ui/icons/NotInterested';
import ListItemIcon from "@material-ui/core/ListItemIcon";
import IconButton from "@material-ui/core/IconButton";
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Fade from "@material-ui/core/Fade";

interface GameInfoProps {
}

//COMPONENT
const GameInfo: FunctionComponent<GameInfoProps> = (props: GameInfoProps) => {
  const {} = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const {gameOptions, status} = useTypedSelector(state => state.game)
  const {name: sessionName} = useTypedSelector(state => state.session)
  const [open, setOpen] = useState();

  return (
    <Paper onClick={() => setOpen(!open)}>
      <Box p={2}>
        <Box className={classes.titleWrapper}><Typography className={classes.title} variant={"subtitle1"}>{status}</Typography>
        {open?<IconButton size={"small"} className={classes.expander} onClick={() => setOpen(!open)}>
          <Fade in={open}><ExpandLessIcon/></Fade>
        </IconButton>:
        <IconButton size={"small"} className={classes.expander} onClick={() => setOpen(!open)}>
          <Fade in={!open}><ExpandMoreIcon/></Fade>
        </IconButton>}</Box>
        <Divider/>
        <Collapse in={open}><List dense>
          {gameOptionDescriptions.map(({id, description, name}) => (
            <ListItem disabled={!(gameOptions[id] == true)} key={id}>
              <ListItemIcon>{
                gameOptions[id]
                  ? <CheckIcon color={"primary"}/>
                  : <NotInterestedIcon/>}
              </ListItemIcon>
              <ListItemText primary={name} secondary={description}/>
            </ListItem>))}
        </List></Collapse>
      </Box>
    </Paper>);
};

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  expander: {
    display: "inline-block"
  },
  titleWrapper: {
    display:"flex",
    alignItems:"center"
  },
  title: {
    flexGrow: 1,
    display: "inline-block"
  }
}));

export default GameInfo;
