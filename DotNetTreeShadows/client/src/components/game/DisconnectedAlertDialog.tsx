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


interface DisconnectedAlertProps {
}

//COMPONENT
const DisconnectedAlertDialog: FunctionComponent<DisconnectedAlertProps> = (props: DisconnectedAlertProps) => {
    const {} = props;
    const classes = useStyles();
    const dispatch = useDispatch();
    const {connectionState, sessionDisconnected} = useTypedSelector(state => state.signalR);

    const isDisconnected = connectionState == HubConnectionState.Disconnected;

    switch (sessionDisconnected) {
        case true:
            return <Dialog
                open={isDisconnected}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Game Server Disconnected"}</DialogTitle>
                <DialogContent>
                    <DialogContentText>The connection to the game server has been interrupted.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={()=>gameHub.connect()}>Reconnect</Button>
                    <Button component={Link} to={"/sessions"}>Exit Session</Button>
                </DialogActions>
            </Dialog>
        default:
            return <Dialog
            open={isDisconnected}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description">
            <DialogTitle id="alert-dialog-title">{"Connecting to Server"}</DialogTitle>
            <DialogContent>
                <div className={classes.circularProgress}><CircularProgress/></div>
            </DialogContent>
            <DialogActions>
                <Button component={Link} to={"/sessions"}>Exit Session</Button>
            </DialogActions>
        </Dialog>

    }
};

const useStyles = makeStyles((theme: Theme) => ({
    root: {},
    circularProgress: {
        display: "flex",
        width: "100%",
        justifyContent:"center",
        paddingBottom: theme.spacing(2)
    }
}));

export default DisconnectedAlertDialog;
