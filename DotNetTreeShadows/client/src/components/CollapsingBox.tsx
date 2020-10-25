import React, { FunctionComponent, useState, PropsWithChildren } from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Paper, Collapse } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Fade from '@material-ui/core/Fade';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import { gameOptionDescriptions } from './game/sessionSidebar/HostOptions';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import CheckIcon from '@material-ui/icons/Check';
import NotInterestedIcon from '@material-ui/icons/NotInterested';
import ListItemText from '@material-ui/core/ListItemText';

interface ICollapsingBoxProps {
  startOpen?:boolean
  title: string,
}

type CollapsingBoxProps = PropsWithChildren<ICollapsingBoxProps>

//COMPONENT
const CollapsingBox: FunctionComponent<CollapsingBoxProps> = (props: CollapsingBoxProps) => {
  const {title, children} = props;

  const startOpen = props.startOpen ?? true;

  const classes = useStyles();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(startOpen)

  return (
      <Paper>
        <Box p={2}>
          <Box className={classes.titleWrapper}><Typography className={classes.title}
                                                            variant={"subtitle1"}>{title}</Typography>
            {open
             ? <IconButton size={"small"}
                           className={classes.expander}
                           onClick={() => setOpen(!open)}>
               <Fade in={open}><ExpandLessIcon /></Fade>
             </IconButton>
             : <IconButton size={"small"}
                           className={classes.expander}
                           onClick={() => setOpen(!open)}>
               <Fade in={!open}><ExpandMoreIcon /></Fade>
             </IconButton>}</Box>
          <Collapse in={open}>
            <Divider className={classes.divider}/>
            {children}
          </Collapse>
        </Box>
      </Paper>);
};

const useStyles = makeStyles((theme: Theme) => (
    {
      root: {},
      expander: {
        display: "inline-block"
      },
      titleWrapper: {
        display: "flex",
        alignItems: "center"
      },
      divider: {
        marginBottom: theme.spacing(1)
      },
      title: {
        flexGrow: 1,
        display: "inline-block"
      }
    }));

export default CollapsingBox;
