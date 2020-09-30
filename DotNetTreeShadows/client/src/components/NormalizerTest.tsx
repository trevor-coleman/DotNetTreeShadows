import React, {FunctionComponent} from 'react';
import {connect, ConnectedProps} from 'react-redux';
import {RootState} from '../store';
import {makeStyles} from '@material-ui/core/styles';
import {signInUserAsync} from "../store/system/thunks";
import {SignInCredentials} from "../store/system/types";
import {getSessionsInfoAsync} from "../store/user/thunks";
import {getSessionAsync} from "../store/sessions/thunks";
import { Paper } from '@material-ui/core';
import {getSession} from "../store/sessions/actions";

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

    const {loggedIn, signIn, sessions, getSession, session, authInProgress, gettingSession} = props;

    if(!loggedIn && !authInProgress) {
        signIn( {
            email: 'trevor@trevor.com',
            password: 'Password'
        })
    }

    if(loggedIn && !session.session && sessions && !gettingSession) {
        getSession(sessions[0].id)
    }


    return <div><Paper>{loggedIn ? "LoggedIn" : ""}-{sessions ? sessions[0].name : "no sessions"}</Paper></div>;
};

const useStyles = makeStyles({});

export default connector(NormalizerTest);
