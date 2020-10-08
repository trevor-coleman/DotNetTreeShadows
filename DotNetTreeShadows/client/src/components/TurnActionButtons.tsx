import React from 'react';
import Button from '@material-ui/core/Button';
import {makeStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { useDispatch, useSelector } from 'react-redux';
import { sendTurnAction, GameActionType } from '../store/game/actions';
import { PieceType } from '../store/board/pieceType';
import { RootState } from '../store';

const useStyles = makeStyles({root:{padding:10},
  turnActionButton: {
  width: 120,
  }})

const TurnActionButtons = ()=>{
  const classes = useStyles();
  const {id:sessionId} = useSelector((state:RootState)=>state.session)
  const dispatch= useDispatch();
  return (<div className={classes.root}>
    <Grid container spacing={2}>
      <Grid item><Button className={classes.turnActionButton} variant="contained" onClick={
        ()=>dispatch(
            sendTurnAction({
              sessionId,
              actionRequest: {
                type: GameActionType.Buy,
                pieceType: PieceType[PieceType.LargeTree]
              }
            }
            ))
      }>Buy</Button></Grid>
      <Grid item><Button className={classes.turnActionButton} variant="contained">Plant</Button></Grid></Grid>
    <Grid container spacing={2}>
      <Grid item><Button className={classes.turnActionButton} variant="contained">Grow</Button></Grid>
      <Grid item><Button className={classes.turnActionButton} variant="contained">Collect</Button></Grid>
    </Grid>
  </div>)
}

export default TurnActionButtons;
