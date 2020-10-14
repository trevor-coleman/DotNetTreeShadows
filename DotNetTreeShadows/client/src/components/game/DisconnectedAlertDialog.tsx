import React, {FunctionComponent} from 'react';
import {useDispatch} from 'react-redux';
import {makeStyles, Theme} from '@material-ui/core/styles';
import {Dialog} from "@material-ui/core";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import {useTypedSelector} from "../../store";
import {HubConnectionState} from "@microsoft/signalr";
import CircularProgress from "@material-ui/core/CircularProgress";
import gameHub from '../../gamehub'
import {Link} from "react-router-dom";
import {ConnectionMessage} from "../../store/signalR/connectionMessage";
import { retryConnection, retryTimeout } from '../../store/signalR/reducer';
import uuid from 'uuid-random';


interface DisconnectedAlertProps {
}

//COMPONENT
const DisconnectedAlertDialog: FunctionComponent<DisconnectedAlertProps> = (props: DisconnectedAlertProps) => {
  const {} = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const {connectionState, connectionMessage} = useTypedSelector(state => state.signalR);
  const {id:sessionId}  = useTypedSelector(state => state.session);

  const isDisconnected = connectionState == HubConnectionState.Disconnected;


  return (<>
    <Dialog
      open={connectionMessage == ConnectionMessage.ConnectionLost}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{"Game Server Disconnected"}</DialogTitle>
      <DialogContent>
        <DialogContentText>The connection to the game server could not be re-established.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => {
          const retryId = uuid()
          dispatch(retryConnection(retryId))
          setTimeout(()=>dispatch(retryTimeout(retryId)), 60000)
          gameHub.tryConnectToSession(sessionId)
        }}>Retry</Button>
        <Button component={Link} to={"/sessions"}>Exit Session</Button>
      </DialogActions>
    </Dialog>)
    <Dialog
      open={connectionMessage == ConnectionMessage.ConnectingToServer}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description">
      <DialogTitle id="alert-dialog-title">{"Connecting to Server"}</DialogTitle>
      <DialogContent>
        <div className={classes.circularProgress}><CircularProgress/></div>
      </DialogContent>
      <DialogActions>
        <Button component={Link} to={"/sessions"}>Cancel</Button>
      </DialogActions>
    </Dialog></>)
}


const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  circularProgress: {
    display: "flex",
    width: "100%",
    justifyContent: "center",
    paddingBottom: theme.spacing(2)
  }
}));

export default DisconnectedAlertDialog;
