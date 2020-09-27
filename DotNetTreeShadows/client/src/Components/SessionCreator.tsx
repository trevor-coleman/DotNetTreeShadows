import React, { FunctionComponent, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../store';
import { makeStyles } from '@material-ui/core/styles';
import { Card, CardContent, Typography } from '@material-ui/core';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';

//REDUX MAPPING
const mapStateToProps = (state: RootState) => {
  return {sessions: state.user.profile?.sessions};
};

const mapDispatchToProps = {};

//REDUX PROP TYPING
const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

interface ISessionCreatorProps {}

type SessionCreatorProps = ISessionCreatorProps & PropsFromRedux;

//COMPONENT
const SessionCreator: FunctionComponent<SessionCreatorProps> = (props: SessionCreatorProps) => {
  const classes = useStyles();

  const {sessions} = props;

  const [session, setSession] = useState<string>("");

  const changeSession = (sessionId:string) => {
    setSession(sessionId);
  }

  return <Card><CardContent><Typography variant={'h5'}>Session</Typography>
    <Button>Add Session</Button>
    <Select labelId="session-select" id="session-select" value={session} onChange={(e: React.ChangeEvent<{ name?: string; value: unknown }>)=>changeSession(e.target.value as string)}>
      {sessions ? sessions.map(sessionId=><MenuItem key={sessionId} value={sessionId}>{sessionId}</MenuItem>):""}
    </Select>
  </CardContent></Card>;
};

const useStyles = makeStyles({});

export default connector(SessionCreator);
