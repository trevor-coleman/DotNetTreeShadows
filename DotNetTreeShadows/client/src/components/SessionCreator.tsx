import React, { FunctionComponent, useState } from 'react';
import {connect, ConnectedProps, useDispatch, useSelector} from 'react-redux';
import { RootState } from '../store';
import { makeStyles } from '@material-ui/core/styles';
import {Card, CardContent, InputLabel, Typography} from '@material-ui/core';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import {createSessionAndFetchProfile, fetchSession} from "../store/session/actions";
import FormControl from "@material-ui/core/FormControl";


interface SessionCreatorProps {}



//COMPONENT
const SessionCreator: FunctionComponent<SessionCreatorProps> = (props: SessionCreatorProps) => {
  const classes = useStyles();
  const dispatch=useDispatch();
  const {signedIn} = useSelector((state:RootState)=>state.auth)
  const {sessions} = useSelector((state:RootState)=>state.profile)
  const {id:sessionId} = useSelector((state:RootState)=>state.session);

  const [selectedId, setSelectedId] = useState(sessionId);

  const changeSession= (id:string)=> {
    setSelectedId(id);
    dispatch(fetchSession(id));
  }


  return (<div className={classes.root}>
    <FormControl className={classes.select}>
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
    </Select></FormControl> {' '} <Button variant={"outlined"} onClick={()=>dispatch(createSessionAndFetchProfile())}>Add Session</Button>
  </div>);
};

const useStyles = makeStyles({root:{width:"fit-content"},select: {width: "15em", marginRight:10}});

export default SessionCreator;
