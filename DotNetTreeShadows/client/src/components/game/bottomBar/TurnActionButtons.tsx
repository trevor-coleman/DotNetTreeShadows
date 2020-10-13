import React from 'react';
import Button from '@material-ui/core/Button';
import {makeStyles, Theme} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import {Typography} from "@material-ui/core";
import {useTypedSelector} from "../../../store";

const useStyles = makeStyles((theme:Theme)=>(
    {root:{},
  turnActionButton: {
      width:80
  },
      endTurnButton: {
        width:80,
        height:80,
      },
title: {
  marginBottom: theme.spacing(1),
}}))

const TurnActionButtons = ()=>{
  const classes = useStyles();
  const {id:sessionId} = useSelector((state:RootState)=>state.session)
  const dispatch= useDispatch();
  const {currentTurn, turnOrder}=useTypedSelector(state => state.game)
  const {id:playerId}=useTypedSelector(state => state.profile)
  const isPlayersTurn = playerId == turnOrder[currentTurn];
  return (<div className={classes.root}>
    <Typography variant={'h6'} className={classes.title}>Actions</Typography>
    <Grid container spacing={1}>
      <Grid item container spacing={1} xs={11}>
        <Grid item><Button disabled={!isPlayersTurn} color={"primary"} className={classes.turnActionButton} size={"medium"} variant="contained">Buy</Button></Grid>
      <Grid item><Button disabled={!isPlayersTurn} color={"primary"} className={classes.turnActionButton} variant="contained">Plant</Button></Grid>
      <Grid item ><Button disabled={!isPlayersTurn} color={"primary"} className={classes.turnActionButton} variant="contained">Grow</Button></Grid>
        <Grid item ><Button disabled={!isPlayersTurn} color={"primary"} className={classes.turnActionButton} variant="contained">Collect</Button></Grid>
      </Grid>
      <Grid item container xs={1}><Button disabled={!isPlayersTurn} className={classes.endTurnButton}  color={"secondary"} variant={"contained"}>End Turn</Button> </Grid>
    </Grid>
  </div>)
}

export default TurnActionButtons;
