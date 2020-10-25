import React, { FunctionComponent, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { makeStyles, Theme } from "@material-ui/core/styles";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import useSound from "use-sound";
import CloseIcon from "@material-ui/icons/Close";
import {
  useTurnAlertCounts,
  showedRevolutionAlert,
  useFirstPlayerName,
  playedEndTurnSound,
} from "../../../store/game/reducer";
import { AlertTitle } from "@material-ui/lab";
import { useIsPlayersTurn } from "../../../store/profile/reducer";

const yourTurn = require(
    "../../../audio/352653__foolboymedia__piano-notification-1.mp3");
const gameOver = require(
    "../../../audio/352650__foolboymedia__piano-notification-4.mp3")
const endTurn = require(
    "../../../audio/352651__foolboymedia__piano-notification-3.mp3")
const endRevolution = require(
    "../../../audio/352652__foolboymedia__piano-notification-2.mp3")

interface TurnAlertSnackBarProps {
}

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6}  {...props} />;
}

//COMPONENT
const TurnAlertSnackBar: FunctionComponent<TurnAlertSnackBarProps> = (props: TurnAlertSnackBarProps) => {
  const {} = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const turnAlerts = useTurnAlertCounts()
  const firstPlayerName = useFirstPlayerName()
  const isPlayersTurn = useIsPlayersTurn();

  const [playEndOfRevolution] = useSound(endRevolution);
  const [playEndTurnSound] = useSound(endTurn);
  const [playYourTurnSound] = useSound(yourTurn);

  const {count, revolution, gameLength, turnCount, turnAlertCount} = turnAlerts;

  useEffect(()=>{
    if (turnCount > turnAlertCount) {

      if(count < revolution) {
        setOpen(true);
        dispatch(showedRevolutionAlert(revolution))
      }

      if (isPlayersTurn) {
        playYourTurnSound()
      }
      else {
        if (count < revolution) {
          playEndOfRevolution();

        }
        else {
          playEndTurnSound();
        }
      }
      dispatch(playedEndTurnSound(turnCount))
    }},
    [turnAlerts])





  const handleClose = (event: React.SyntheticEvent | React.MouseEvent,
                       reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
      <div>
        <Button onClick={() => {
          playEndOfRevolution();
          setOpen(true);
        }}>
          Toggle Snackbar
        </Button>
        <Snackbar open={open}
                  className={classes.root}
                  autoHideDuration={6000}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "center"
                  }}>
          <Alert severity="info"
                 action={<IconButton size="small"
                                     aria-label="close"
                                     color="inherit"
                                     onClick={handleClose}>
                   <CloseIcon fontSize="small" />
                 </IconButton>}>
            <AlertTitle>End of Round {revolution}</AlertTitle>
            {`Beginning revolution ${revolution +
                                     1} of ${gameLength}. First player is now ${firstPlayerName}`}{" "}
          </Alert>
        </Snackbar>
      </div>);
};

const useStyles = makeStyles((theme: Theme) => (
    {
      root: {marginTop: theme.spacing(8)},
    }));

export default TurnAlertSnackBar;
