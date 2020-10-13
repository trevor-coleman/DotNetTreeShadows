import React, {FunctionComponent, useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {makeStyles, Theme} from '@material-ui/core/styles';
import {Box, IconButton} from "@material-ui/core";
import GameBoard from "../game/board/GameBoard";
import SessionSidebar from "../game/sessionSidebar/SessionSidebar";
import PlayerSidebar from "../game/playerSidebar/PlayerSidebar";
import BottomBar from "../game/bottomBar/BottomBar";
import {fetchSession} from "../../store/session/thunks";
import {connectToSession, disconnectFromSession} from "../../store/signalR/actions";
import {clearSession} from "../../store/session/reducer";
import {useParams} from "react-router-dom";
import {useTypedSelector} from "../../store";
import Container from "@material-ui/core/Container";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import AppBar from "@material-ui/core/AppBar";
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import {Link} from 'react-router-dom'
import { signOut } from '../../store/auth/reducer';


interface FlexGameScreenProps {
}

//COMPONENT
const FlexGameScreen: FunctionComponent<FlexGameScreenProps> = (props: FlexGameScreenProps) => {
    const {} = props;
    const classes = useStyles();
    const dispatch = useDispatch();
    const {sessionId: sessionIdFromPath} = useParams();
    const {id: sessionIdFromState, loadingSessionState, name: sessionName} = useTypedSelector(state => state.session);

    const loadSession = async () => {
        await dispatch(fetchSession(sessionIdFromPath))
        await dispatch(connectToSession(sessionIdFromPath));
    }

    const clearSessionOnLeave = async () => {

        await dispatch(disconnectFromSession(sessionIdFromPath));
        dispatch(clearSession())

    }

    useEffect(() => {

            loadSession();

            return () => {
                clearSessionOnLeave();
            }
        },
        []
    )

    const handleSignOut = ()=>{dispatch(signOut())};


    return (
        <Container maxWidth={false} className={classes.root}>
            <AppBar
                position="fixed"
                className={classes.appBar}
            >
                <Toolbar>
                    <IconButton color={"inherit"}  component={Link} to={"/sessions"}><ArrowBackIosIcon/></IconButton>
                    <Typography variant="h6" noWrap className={classes.title}>
                        {sessionName}
                    </Typography>
                    <Button color="inherit" onClick={handleSignOut}>Sign Out</Button>
                </Toolbar>
            </AppBar>

            <Box className={classes.leftPanel}>
                <div className={classes.toolbarSpacer}/>
                <SessionSidebar/>
            </Box>
            <Box className={classes.gamePanel}>
                <div className={classes.toolbarSpacer}/>
                <Box className={classes.gameWrapper}>
                    <GameBoard/>
                </Box>
                <Box className={classes.bottomBar}>
                    <BottomBar/>
                </Box>
            </Box>
            <Box className={classes.rightPanel}>
                <div className={classes.toolbarSpacer}/>
                <PlayerSidebar/>
            </Box>
        </Container>
    );
};

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        display: "flex",
        padding:0,
        height: "100vh",
        width: "100vw",
        maxWidth: "100vw",
        overflow: "hidden"
    },
    leftPanel: {
        flexShrink: 0,
        backgroundColor: "#c9c9c9",
        width: 320,
        height: "100vh"
    },
    gamePanel: {
        display: "flex",
        flex: 1,
        flexDirection: "column",
        backgroundColor: "green",
        alignItems: "center",
        justifyContent: "center",
        minWidth: 600,
    },
    bottomBar: {
        width: "100%",
    },
    gameWrapper: {
        width: "100%",
        flex: 1,
        maxWidth: "80vh",
    },

    rightPanel: {
        backgroundColor: "#c9c9c9",
        width: 320,
        flexShrink: 0,
        height: "100vh"
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
    },
    title: {
        flexGrow: 1,
    },
    toolbarSpacer: {
        ...theme.mixins.toolbar
    }
}));

export default FlexGameScreen;
