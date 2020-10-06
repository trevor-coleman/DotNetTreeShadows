import React, { FunctionComponent, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../store';
import { makeStyles } from '@material-ui/core/styles';
import { Card, CardContent, Typography } from '@material-ui/core';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import { createSessionAsync, getSessionAsync } from '../store/sessions/thunks';
import { getSessionsInfoAsync } from '../store/z_old-user/thunks';

//REDUX MAPPING
const mapStateToProps = (state: RootState) => {
  return {
    sessions: state.user.profile?.sessions,
    loggedIn: state.system.loggedIn,
  };
};

const mapDispatchToProps = {
  createSession: () => createSessionAsync(),
  getSession: (id: string) => getSessionAsync(id),
  getSessionsInfo: () => getSessionsInfoAsync(),
};

//REDUX PROP TYPING
const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

interface ISessionCreatorProps {}

type SessionCreatorProps = ISessionCreatorProps & PropsFromRedux;

//COMPONENT
const SessionCreator: FunctionComponent<SessionCreatorProps> = (props: SessionCreatorProps) => {
  const classes = useStyles();

  const {sessions, createSession, getSession, loggedIn} = props;

  const [sessionId, setSessionId] = useState<string>("");
  const [sessionName, setSessionName] = useState<string>("");

  const changeSession = (sessionId: string) => {
    setSessionId(sessionId);

    getSession(sessionId);
  };

  return <Card><CardContent><Typography variant={'h5'}>Session</Typography>
    <div> <Button onClick={createSession}>Add Session</Button></div>
    <div><Select
      disabled={!loggedIn}
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

export default connector(SessionCreator);
