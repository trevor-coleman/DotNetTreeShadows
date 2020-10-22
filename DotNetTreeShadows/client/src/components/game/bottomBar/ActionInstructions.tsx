import React, {FunctionComponent} from 'react';
import {useDispatch} from 'react-redux';
import {makeStyles, Theme} from '@material-ui/core/styles';
import {clearCurrentAction} from '../../../store/game/reducer';
import {Typography} from "@material-ui/core";
import {GameActionType} from "../../../store/game/actions";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import {useTypedSelector} from "../../../store";
import Game from "../../../store/game/types/game";


interface ActionInstructionsProps {
}

interface Instruction {
  headline: string,
  actionInstruction: string,
  buttonText?: string
}


//COMPONENT
const ActionInstructions: FunctionComponent<ActionInstructionsProps> = (props: ActionInstructionsProps) => {
  const {} = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const currentActionType = useTypedSelector(state => state.game.currentActionType)
  const origin = useTypedSelector(state => state.game.currentActionOrigin)
  const handleCancel = () => {
    dispatch(clearCurrentAction())
  }

  const getInstructions = (actionType: GameActionType | null): Instruction => {
    switch (actionType) {
      case GameActionType.Buy:
        return {
          headline: "Buy",
          actionInstruction: "Select a piece on your player board to buy.",
          buttonText: "Done"
        }
      case GameActionType.Plant:
        return {
          headline: "Plant",
          actionInstruction: origin == null ? "Select a tree to act as the origin" : "Select a tile to plant your seed."
        }
      case GameActionType.Grow:
        return {
          headline: "Grow",
          actionInstruction: "Select a seed or tree to grow."
        }
      case GameActionType.Collect:
      case GameActionType.EndTurn:
      case GameActionType.StartGame:
      case GameActionType.PlaceStartingTree:
      case GameActionType.UndoAction:
      case GameActionType.Resign:
      case GameActionType.Kick:
      default:
        return {
          headline: "Select an action",
          actionInstruction: "No action selected"
        }

    }

  }


  const {headline, actionInstruction, buttonText} = getInstructions(currentActionType);

  return (
    <Grid container spacing={2}>
      <Grid item><Typography variant={'subtitle1'}>{headline}</Typography></Grid>
      <Grid container item className={classes.container} direction={"column"} xs={12}>
        <Grid item className={classes.instruction}>
          <Typography variant={"h6"} paragraph>{actionInstruction}</Typography>
        </Grid>
        <Grid item container className={classes.cancelButton}>
          <Grid item className={classes.buttonSpacer}/>
          <Grid item>
            <Button onClick={handleCancel} variant={"contained"}>{buttonText ?? "Cancel"}</Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  container: {
    flexGrow: 1,
    width: "100%"
  },
  instruction: {
    flexGrow: 1
  },
  cancelButton: {
    alignItems: "flex-end",
    justifyContent: "flex-end",
  },
  buttonSpacer: {
    flexGrow: 1
  }
}));

export default ActionInstructions;
