import React, { FunctionComponent, useEffect } from "react";
import { useDispatch } from "react-redux";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { Box, IconButton } from "@material-ui/core";
import GameBoard from "./board/GameBoard";
import SessionSidebar from "./sessionSidebar/SessionSidebar";
import PlayerSidebar from "./playerSidebar/PlayerSidebar";
import BottomBar from "./bottomBar/BottomBar";
import { disconnectFromSession } from "../../store/signalR/thunks";
import { clearSession } from "../../store/session/reducer";
import { Link, useParams } from "react-router-dom";
import { useTypedSelector } from "../../store";
import Container from "@material-ui/core/Container";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import AppBar from "@material-ui/core/AppBar";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import gameHub from "../../gamehub";
import DisconnectedAlertDialog from "./dialogs/DisconnectedAlertDialog";
import { Alert } from "@material-ui/lab";
import Collapse from "@material-ui/core/Collapse";
import { HubConnectionState } from "@microsoft/signalr";
import TurnAlertSnackBar from "./dialogs/TurnAlertSnackBar";
import GameOverDialog from "./dialogs/GameOverDialog/GameOverDialog";
import { signOutAndClearStore } from "../../store/auth/thunks";
import DiscardAlertDialog from "./dialogs/DiscardAlertDialog";
import AddPlayerDialog from './dialogs/AddPlayerDialog';
import RulesDialog from './dialogs/RulesDialog';
import { showRulesDialog } from "../../store/appState/reducer";

interface GameScreenProps {dummy?:boolean}

//COMPONENT
const GameScreen: FunctionComponent<GameScreenProps> = (
  props: GameScreenProps
) => {
  const {dummy} = props;
  const classes = useStyles(props);
  const dispatch = useDispatch();
  const { sessionId: sessionIdFromPath } = useParams();
  const { name: sessionName } = useTypedSelector(state => state.session);
  const { connectionState } = useTypedSelector(state => state.signalR);

  const onLoad = async () => {
    dispatch(clearSession());
    if(dummy) return;
    await gameHub.tryConnectToSession(sessionIdFromPath);
  };

  const cleanUp = async () => {
    await dispatch(disconnectFromSession(sessionIdFromPath));
    dispatch(clearSession());
  };

  useEffect(() => {
    onLoad();

    return () => {
      cleanUp();
    };
  }, []);

  const handleSignOut = () => {
    dispatch(signOutAndClearStore());
  };
  const showRules = () => {
    dispatch(showRulesDialog(true));
  };

  return (
    <Container maxWidth={false} className={classes.root}>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton color={"inherit"} component={Link} to={"/sessions"}>
            <ArrowBackIosIcon />
          </IconButton>
          <Typography variant="h6" noWrap className={classes.title}>
            {sessionName} - {connectionState ?? undefined}
          </Typography>
          <Button color="inherit" onClick={showRules}>
            Rules
          </Button>
          <Button color="inherit" onClick={handleSignOut}>
            Sign Out
          </Button>
        </Toolbar>
      </AppBar>

      <Box className={classes.leftPanel}>
        <div className={classes.toolbarSpacer} />
        <SessionSidebar />
      </Box>
      <Box className={classes.gamePanel}>
        <div className={classes.toolbarSpacer} />
        <Box className={classes.gameWrapper}>
          <Box>
            <Box zIndex={"modal"}>
              <Collapse in={connectionState == HubConnectionState.Reconnecting}>
                <Alert severity="warning">
                  Connection disconnected - attempting to reconnect.
                </Alert>
              </Collapse>
            </Box>
            <GameBoard />
          </Box>
        </Box>
        <Box className={classes.bottomBar}>
          <BottomBar />
        </Box>
      </Box>
      <Box className={classes.rightPanel}>
        <div className={classes.toolbarSpacer} />
        <PlayerSidebar />
      </Box>
      <TurnAlertSnackBar />
      <AddPlayerDialog />

      {dummy ? "": <DisconnectedAlertDialog />}
      <GameOverDialog />
      <DiscardAlertDialog />
      <RulesDialog/>
    </Container>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: "flex",
    padding: 0,
    height: "100vh",
    width: "100vw",
    maxWidth: "100vw",
    overflow: "hidden",
    filter: ({ dummy }:GameScreenProps) => dummy ? "blur(4px)":undefined,
  },
  leftPanel: {
    flexShrink: 0,
    backgroundColor: "#c9c9c9",
    width: 300,
    height: "100vh",
    overflow:"scroll",
  },
  gamePanel: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    backgroundColor: "green",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 600
  },
  bottomBar: {
    width: "100%",
    height: "fit-content"
  },
  gameWrapper: {
    width: "100%",
    flex: 1,
    maxWidth: "75vh",
    alignItems: "flex-end"
  },

  rightPanel: {
    backgroundColor: "#c9c9c9",
    width: 280,
    flexShrink: 0,
    height: "100vh",
    overflow: "scroll",
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1
  },
  title: {
    flexGrow: 1
  },
  toolbarSpacer: {
    ...theme.mixins.toolbar
  }
}));

export default GameScreen;
