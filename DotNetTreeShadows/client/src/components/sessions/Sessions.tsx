import React, { FunctionComponent, useEffect } from "react";
import { useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Typography } from "@material-ui/core";
import { useTypedSelector } from "../../store";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import { Link } from "react-router-dom";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import { deleteSession } from "../../store/session/actions";
import DeleteOutlineOutlinedIcon from "@material-ui/icons/DeleteOutlineOutlined";
import { createSessionAndFetchProfile } from "../../store/session/thunks";
import SessionInviteList from "./SessionInvites";
import Paper from "@material-ui/core/Paper";
import ListItemText from "@material-ui/core/ListItemText";
import FriendAvatar from "../friends/FriendAvatar";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import AddIcon from "@material-ui/icons/Add";
import { fetchProfile } from "../../store/profile/reducer";
import { fetchInvitations } from "../../store/invitations/reducer";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";

interface SessionsProps {}

//COMPONENT
const Sessions: FunctionComponent<SessionsProps> = (props: SessionsProps) => {
  const {} = props;
  const classes = useStyles();
  const dispatch = useDispatch();

  const onLoad = async () => {
    await dispatch(fetchProfile());
    await dispatch(fetchInvitations());
  };

  useEffect(() => {
    onLoad();
  }, []);

  const { sessions, id, friends } = useTypedSelector(state => state.profile);
  return (
    <Box>
      <Grid container direction={"column"} spacing={2}>
        <Grid item xs={8}>
          <Typography paragraph variant={"h6"}>
            Sessions
          </Typography>
          <Divider />
        </Grid>
        <Grid item xs={8}>
          <Paper className={classes.root}>
            <Box p={3}>
              <SessionInviteList type={"received"} />
              <List>
                {sessions.map(session => (
                  <ListItem
                    component={Link}
                    to={`/sessions/${session.id}`}
                    button
                    key={session.id}
                  >
                    <ListItemAvatar>
                      <FriendAvatar id={session.host} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={session.name}
                      secondary={`Hosted by ${session.hostName}`}
                    />
                    {session.host == id ? (
                      <ListItemSecondaryAction>
                        <IconButton
                          onClick={() => dispatch(deleteSession(session.id))}
                        >
                          <DeleteOutlineOutlinedIcon color={"secondary"} />
                        </IconButton>
                      </ListItemSecondaryAction>
                    ) : (
                      ""
                    )}
                  </ListItem>
                ))}
                <ListItem
                  button
                  onClick={() => {
                    dispatch(createSessionAndFetchProfile());
                  }}
                >
                  <ListItemAvatar>
                    <Avatar className={classes.addSessionAvatar}>
                      <AddIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={"Add New session"} />
                </ListItem>
              </List>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

const useStyles = makeStyles({
  root: {},
  addSessionAvatar: {
    backgroundColor: "white",
    color: "grey",
    border: "1px dashed grey"
  }
});

export default Sessions;
