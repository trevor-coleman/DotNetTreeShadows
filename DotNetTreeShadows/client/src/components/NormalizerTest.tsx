import React, {FunctionComponent} from 'react';
import {connect, ConnectedProps} from 'react-redux';
import {RootState} from '../store';
import {makeStyles} from '@material-ui/core/styles';
import {signInUserAsync} from "../store/z_old-system/thunks";
import {getSessionsInfoAsync} from "../store/z_old-user/thunks";
import {createSessionAsync, getSessionAsync} from "../store/sessions/thunks";
import {Paper, Button} from '@material-ui/core';
import {getSession} from "../store/sessions/actions";
import DebugToolbar from "./DebugToolbar";
import {SignInCredentials} from "../types/auth/signInCredentials";

//REDUX MAPPING
const mapStateToProps = (state: RootState) => {
    return {
        loggedIn: state.system.loggedIn,
        authInProgress: state.system.authInProgress,
        sessions: state.user.profile?.sessions,
        session: state.session,
        gettingSession: state.session.sessionLoading
    };

};

const mapDispatchToProps = {
    signIn: (credentials: SignInCredentials) => signInUserAsync(credentials),
    getSession: getSessionAsync,
    createSession: createSessionAsync,
};

//REDUX PROP TYPING
const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

interface INormalizerTestProps {
}

type NormalizerTestProps =
    INormalizerTestProps
    & PropsFromRedux;

//COMPONENT
const NormalizerTest: FunctionComponent<NormalizerTestProps> = (props: NormalizerTestProps) => {
    const classes = useStyles();

    const {loggedIn, signIn, sessions, getSession, createSession, session, authInProgress, gettingSession} = props;



    return <div>
        <DebugToolbar/><Paper
        className={classes.root}>{loggedIn ? "LoggedIn" : ""}-{sessions && sessions[0] ? sessions[0].name : "no sessions"}</Paper>
        <Paper><Button onClick={() => signIn({
            email: 'trevor@trevor.com',
            password: 'Password'
        })}>Sign in</Button>{' '}<Button onClick={createSession}>Create</Button> {' '}<Button disabled={!sessions} onClick={() => sessions ? getSession(sessions[0].id) : console.log("no session")}>GetSession</Button></Paper></div>;
};

const useStyles = makeStyles({
    root: {
        padding: 20,
    }
});

export default connector(NormalizerTest);
