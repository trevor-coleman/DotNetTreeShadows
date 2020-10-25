import React, { FunctionComponent } from "react";
import { useDispatch } from "react-redux";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { Paper } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import TurnActionButtons from "./TurnActionButtons";
import LightDisplay from "./LightDisplay";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import { useTypedSelector } from "../../../store";
import ActionInstructions from "./ActionInstructions";
import { useGameStatus } from "../../../store/game/reducer";
import { GameStatus } from "../../../store/game/types/GameStatus";
import PreGameInstructions from "./PreGameInstructions";
import { useIsHost } from "../../../store/profile/reducer";
import HostOptions from "../sessionSidebar/HostOptions";

interface BottomBarProps {}

//COMPONENT
const BottomBar: FunctionComponent<BottomBarProps> = (
  props: BottomBarProps
) => {
  const {} = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const { currentActionType } = useTypedSelector(state => state.game);
  const status = useGameStatus();
  const isHost = useIsHost();

  return (
    <Paper className={classes.root}>
      <Box p={2}>
        {status == GameStatus.Preparing
         ? (
             isHost
             ? (
                 <HostOptions />)
             : (
                 <PreGameInstructions />))
         : <Grid container spacing={2}>
          <Grid item xs={5}>
            <LightDisplay />
          </Grid>
          <Grid item>
            <Divider
              orientation="vertical"
              flexItem
              style={{ height: "100%" }}
            />
          </Grid>
          <Grid item xs={6}>
            {status == GameStatus.PlacingFirstTrees ||
              status == GameStatus.PlacingSecondTrees ? (
              <ActionInstructions />
            ) : currentActionType == null ? (
              <TurnActionButtons />
            ) : (
              <ActionInstructions />
            )}
          </Grid>
        </Grid>}
      </Box>
    </Paper>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    height: "fit-content",
    width: "100%"
  }
}));

export default BottomBar;
