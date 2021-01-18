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
import ActionInformation from "./ActionInformation";

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
    <Box p={1} className={classes.root}>
      <Grid container spacing={1} direction={"column"} className={classes.topGrid}>

        <Grid item container>
          <Paper>
            <Box p={2}>
        {status == GameStatus.Preparing ? (
          isHost ? (
            <HostOptions />
          ) : (
            <PreGameInstructions />
          )
        ) : (

              <Grid item container spacing={2}>
                <Grid item xs={3}>
                  <LightDisplay />
                </Grid>
                <Grid item>
                  <Divider
                    orientation="vertical"
                    flexItem
                    style={{ height: "100%" }}
                  />
                </Grid>
                <Grid item xs={8}>
                  {status == GameStatus.PlacingFirstTrees ||
                  status == GameStatus.PlacingSecondTrees ? (
                    <ActionInstructions />
                  ) : currentActionType == null ? (
                    <TurnActionButtons />
                  ) : (
                    <ActionInstructions />
                  )}
                </Grid>
              </Grid>

        )}
            </Box>
          </Paper>
        </Grid>

      </Grid>
    </Box>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    height: "fit-content",
    paddingBottom: theme.spacing(2),
    width: "100%",
    backgroundColor: "#c9c9c9"
  },
  topGrid: {
    height: "fit-content",
    width: "100%",
  },
}));

export default BottomBar;
