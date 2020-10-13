import React from 'react';
import Button from '@material-ui/core/Button';
import {makeStyles, Theme} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import {Typography} from "@material-ui/core";

const useStyles = makeStyles((theme:Theme)=>(
    {root:{},
  turnActionButton: {
      width:90
  },
      endTurnButton: {
        width: 90,
        height:90,
      },
title: {
  marginBottom: theme.spacing(1),
}}))

const TurnActionButtons = ()=>{
  const classes = useStyles();
  const {id:sessionId} = useSelector((state:RootState)=>state.session)
  const dispatch= useDispatch();
  return (<div className={classes.root}>
    <Typography variant={'h6'} className={classes.title}>Actions</Typography>
    <Grid container spacing={2}>
      <Grid item container spacing={1} xs={8}>
        <Grid item><Button color={"primary"} className={classes.turnActionButton} size={"medium"} variant="contained">Buy</Button></Grid>
      <Grid item><Button color={"primary"} className={classes.turnActionButton} variant="contained">Plant</Button></Grid>
      <Grid item ><Button color={"primary"} className={classes.turnActionButton} variant="contained">Grow</Button></Grid>
        <Grid item ><Button color={"primary"} className={classes.turnActionButton} variant="contained">Collect</Button></Grid>
      </Grid>
      <Grid item container xs={4}><Button className={classes.endTurnButton}  color={"secondary"} variant={"contained"}>End Turn</Button> </Grid>
    </Grid>
  </div>)
}

export default TurnActionButtons;
