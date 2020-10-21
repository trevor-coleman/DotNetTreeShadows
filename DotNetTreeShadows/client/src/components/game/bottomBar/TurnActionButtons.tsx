import React from 'react';
import Button from '@material-ui/core/Button';
import {makeStyles, Theme} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../store/store';
import {Typography} from "@material-ui/core";
import {useTypedSelector} from "../../../store";
import {clearCurrentAction, setCurrentAction} from '../../../store/game/reducer';
import {GameActionType} from "../../../store/game/actions";
import PlayerBoard from "../../../store/game/types/playerBoard";
import {PieceType} from "../../../store/board/types/pieceType";

const useStyles = makeStyles((theme: Theme) => (
  {
    root: {},
    turnActionButton: {
      width: 80
    },
    endTurnButton: {
      width: 120
    },
    title: {
      marginBottom: theme.spacing(1),
    }
  }))

const TurnActionButtons = () => {
  const classes = useStyles();
  const {id: sessionId} = useSelector((state: RootState) => state.session)
  const dispatch = useDispatch();
  const {currentTurn, turnOrder, currentAction, playerBoards} = useTypedSelector(state => state.game)
  const {id: playerId} = useTypedSelector(state => state.profile)
  const isPlayersTurn = (playerId == turnOrder[currentTurn]);
  const playerBoardCode = playerBoards[playerId];
  const light = PlayerBoard.GetLight(playerBoardCode);

  const currentActionType = currentAction?.type;

  const onClickActionButton = (actionType: GameActionType) => {
    if (actionType == currentActionType) dispatch(clearCurrentAction())
    else dispatch(setCurrentAction(actionType))
  }

  const canDoAction = (actionType:GameActionType) => {
    switch (actionType ){
      case GameActionType.Buy:
        return false;
      case GameActionType.Plant:
        console.log("Can do Plant")
        return PlayerBoard.getPieces(playerBoardCode, PieceType.Seed).available > 0 && light > 0;

      case GameActionType.Grow:
        return false;
      case GameActionType.Collect:
        return false;
      case GameActionType.EndTurn:
        return true;
      case GameActionType.StartGame:
      case GameActionType.PlaceStartingTree:
      case GameActionType.UndoAction:
      case GameActionType.Resign:
      case GameActionType.Kick:
        return false;
    }
    return false;
  }

  const isDisabled = (actionType: GameActionType) => {
    if(!isPlayersTurn) {
      return true;
    }
    if(currentActionType != null && currentActionType != actionType) {
      return true;
    }
    if(!canDoAction(actionType)) {
      return true;
    }
    return false;

  }

  const GameActionButton = ({actionType}: { actionType: GameActionType }) => (
    <Grid item>
      <Button
        disabled={isDisabled(actionType)}
        color={currentActionType == actionType ? "secondary" : "primary"}
        className={classes.turnActionButton}
        size={"medium"}
        variant="contained"
        onClick={() => onClickActionButton(actionType)}>
        {GameActionType[actionType]}
      </Button>
    </Grid>)

  const turnActions = [GameActionType.Buy, GameActionType.Plant, GameActionType.Grow, GameActionType.Collect]

  return (
    <div className={classes.root}>
      <Typography variant={'subtitle1'} className={classes.title}>Actions</Typography>
      <Grid container spacing={0}>
        <Grid item container xs={8} spacing={1}>
          {turnActions.map(at => <GameActionButton key={at + new Date().toString()} actionType={at}/>)}
        </Grid>
        <Grid item container xs={4} spacing={1} direction={"column"}><Grid item><Button
          disabled={!isPlayersTurn} className={classes.endTurnButton}
          color={light == 0 ? "secondary" : undefined} variant={"contained"}>End Turn</Button> </Grid>
          <Grid item><Button disabled={!isPlayersTurn && currentActionType == null}
                             className={classes.endTurnButton} variant={"contained"}>Undo</Button> </Grid>
        </Grid>
      </Grid>
    </div>)
}

export default TurnActionButtons;
