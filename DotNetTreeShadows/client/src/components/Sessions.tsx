import React, {FunctionComponent} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import {Box, Typography} from "@material-ui/core";
import {useTypedSelector} from "../store";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import {Link} from "react-router-dom";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import {deleteSession} from "../store/session/actions";
import DeleteOutlineOutlinedIcon from "@material-ui/icons/DeleteOutlineOutlined";
import Button from "@material-ui/core/Button";
import {createSessionAndFetchProfile} from "../store/session/thunks";
import AddCircleOutlineOutlinedIcon from "@material-ui/icons/AddCircleOutlineOutlined";
import Grid from "@material-ui/core/Grid";
import SessionInviteList from "./SessionInvites";


interface SessionsProps {
}

//COMPONENT
const Sessions: FunctionComponent<SessionsProps> = (props: SessionsProps) => {
    const {} = props;
    const classes = useStyles();
    const dispatch = useDispatch();
    const {sessions} = useTypedSelector(state => state.profile)

    return (
        <div className={classes.root}>
            <Typography variant={'h4'}>Sessions</Typography>
            <Box>
                <Button variant={"outlined"} onClick={() => {
                    dispatch(createSessionAndFetchProfile())
                }} startIcon={<AddCircleOutlineOutlinedIcon/>}>Add</Button>
            </Box>
            <SessionInviteList type={"received"}/>
            <List>
            {sessions.map(session=><ListItem component={Link} to={`/sessions/${session.id}`} button key={session.id}>{session.name}
            <ListItemSecondaryAction><IconButton onClick={()=>dispatch(deleteSession(session.id))}><DeleteOutlineOutlinedIcon color={"secondary"}/></IconButton></ListItemSecondaryAction></ListItem>)}
            </List>
        </div>)
};

const useStyles = makeStyles({
    root: {}
});

export default Sessions;
