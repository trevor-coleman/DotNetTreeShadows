import React, { FunctionComponent, useState } from 'react';
import {connect, ConnectedProps, useDispatch, useSelector} from 'react-redux';
import { RootState } from '../store';
import { makeStyles } from '@material-ui/core/styles';
import { Card, CardContent, Typography } from '@material-ui/core';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import {createSession} from "../store/session/actions";


interface SessionCreatorProps {}



//COMPONENT
const SessionCreator: FunctionComponent<SessionCreatorProps> = (props: SessionCreatorProps) => {
  const classes = useStyles();
  const dispatch=useDispatch();
  const [sessionId, setSessionId] = useState<string>("");
  const [sessionName, setSessionName] = useState<string>("");
  const {signedIn} = useSelector((state:RootState)=>state.auth)
  const {sessions} = useSelector((state:RootState)=>state.profile)

  const changeSession= (sessionId:string)=> {
    setSessionId(sessionId);

  }


  return <Card><CardContent><Typography variant={'h5'}>Session</Typography>
    <div> <Button onClick={()=>dispatch(createSession())}>Add Session</Button></div>
    <div><Select
      disabled={!signedIn}
      labelId="session-select"
      id="session-select"
      value={sessionId}
      onChange={(e: React.ChangeEvent<{ name?: string; value: unknown }>) => changeSession(e.target.value as string)}>
      {sessions
       ? sessions.map(session => <MenuItem
          key={session.id}
          value={session.id}>{session.name}</MenuItem>)
       : ""}
    </Select></div>
  </CardContent></Card>;
};

const useStyles = makeStyles({});

export default SessionCreator;
