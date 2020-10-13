import React, {FunctionComponent, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../store/store';
import {makeStyles} from '@material-ui/core/styles';
import {InputLabel, IconButton, Box} from '@material-ui/core';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import {deleteSession} from "../store/session/actions";
import FormControl from "@material-ui/core/FormControl";
import Grid from "@material-ui/core/Grid";
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
import {createSessionAndFetchProfile, fetchSession} from '../store/session/thunks'

interface SessionCreatorProps {
}


//COMPONENT
const SessionCreator: FunctionComponent<SessionCreatorProps> = (props: SessionCreatorProps) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const {signedIn} = useSelector((state: RootState) => state.auth)
    const {sessions} = useSelector((state: RootState) => state.profile)
    const {id: sessionId} = useSelector((state: RootState) => state.session);

    const [selectedId, setSelectedId] = useState('');
    const [newSession, setNewSession] = useState(true);


    if ((sessionId != selectedId) && newSession) {
        setSelectedId(sessionId);
        setNewSession(false);
    }
    const changeSession = (id: string) => {
        setSelectedId(id);
        dispatch(fetchSession(id));
    }


    return (<Grid item className={classes.root}>
        <Box><FormControl className={classes.select}>
            <InputLabel id="session-select-label">Session</InputLabel>
            <Select
                disabled={!signedIn}
                id="session-select"
                labelId="session-select-label"
                value={selectedId}
                onChange={(e: React.ChangeEvent<{ name?: string; value: unknown }>) => changeSession(e.target.value as string)}>
                {sessions
                    ? sessions.map(session => <MenuItem
                        key={session.id}
                        value={session.id}>{session.name}</MenuItem>)
                    : ""}
            </Select></FormControl></Box>
        <Box>
            <Button variant={"outlined"} onClick={() => {
                setNewSession(true);
                dispatch(createSessionAndFetchProfile())
            }}><AddCircleOutlineOutlinedIcon className={classes.addIcon}/>Add</Button></Box>
        <Box>
        <IconButton onClick={()=>dispatch(deleteSession(sessionId))} className={classes.deleteButton}><DeleteOutlineOutlinedIcon color={"secondary"}/></IconButton>
    </Box>
    </Grid>);
};

const useStyles = makeStyles({
    root: {
        width: "fit-content",
        alignItems: "flex-end",
        flexDirection: "row",
        display: "flex"
    },
    select: {
        width: "15em",
        marginRight: 8,
    },
    addIcon:{
        marginRight: 8,
    },
    deleteButton: {
        padding:8,
    }
});

export default SessionCreator;
