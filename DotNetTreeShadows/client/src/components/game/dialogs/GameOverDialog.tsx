import React, { FunctionComponent } from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import {
  DialogContent,
  ListItem,
  DialogActions, Button,
} from '@material-ui/core';
import DialogContentText from '@material-ui/core/DialogContentText';
import { RequestState } from '../../../api/requestState';
import CircularProgress from '@material-ui/core/CircularProgress';
import List from '@material-ui/core/List';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Checkbox from '@material-ui/core/Checkbox';
import { useGameStatus, useScores } from '../../../store/game/reducer';
import GameScreen from '../GameScreen';
import { GameStatus } from '../../../store/game/types/GameStatus';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { usePlayers } from '../../../store/session/reducer';
import { ScoringToken } from '../../../store/game/types/scoringToken';
import { useIsHost } from '../../../store/profile/reducer';
import { Link } from 'react-router-dom';

interface GameOverDialogProps {
}

//COMPONENT
const GameOverDialog: FunctionComponent<GameOverDialogProps> = (props: GameOverDialogProps) => {
  const {} = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const status = useGameStatus();
  const scores = useScores();
  const players = usePlayers();
  const isHost = useIsHost();
  const open = status == GameStatus.Ended;

  const scoreDisplay: {
    id:string,
    name:string,
    totalScore: number,
    tokens : ScoringToken[]
  }[] = []

  Object.keys(scores).forEach(id => {
    if(!players[id]) return;
    scoreDisplay.push({
      id,
      name: players[id].name,
      totalScore: scores[id].reduce((acc:number, curr)=> acc + (curr.points), 0),
      tokens: scores[id].sort((a,b)=>b.points - a.points)
    })
  })

  return (
      <div>
        <Dialog open={open}
                aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Game Over</DialogTitle>
          <DialogContent>
            <DialogContentText>
            <Grid container>
              <Grid item>
                {scoreDisplay.map(info=><div key={info.id}><Typography>{info.name} -  {info.totalScore}</Typography>
                  </div>)}
              </Grid>
            </Grid>
            </DialogContentText>
            <DialogActions><Button component={Link} to={"/sessions"}>Exit Session</Button></DialogActions>
          </DialogContent>
        </Dialog>
      </div>
  )
};

const useStyles = makeStyles((theme: Theme) => (
    {
      root: {},
    }));

export default GameOverDialog;
