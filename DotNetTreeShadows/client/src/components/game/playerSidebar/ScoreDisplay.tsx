import React, { FunctionComponent, useState } from "react";
import { useDispatch } from "react-redux";
import { makeStyles, Theme } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import { Typography, Avatar } from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import Paper from "@material-ui/core/Paper";
import { useCollectedScoreTokens } from "../../../store/game/reducer";
import Grid from "@material-ui/core/Grid";
import { tileColor } from "../../helpers/treeColor";
import { ScoringToken } from "../../../store/game/types/scoringToken";
import ScoringTokenAvatar from './ScoringTokenAvatar';

interface ScoreDisplayProps {
  hideScores ?: boolean;
  id?: string|null;
}

//COMPONENT
const ScoreDisplay: FunctionComponent<ScoreDisplayProps> = (
  props: ScoreDisplayProps
) => {
  const {id} = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const hideScores: boolean = props.hideScores || false;
  const scoreTokens = useCollectedScoreTokens(id);

  interface TokenProps {
    token: { leaves: number; points: number };
    hideScores?: boolean;
  }


  const compareTokens = (a: ScoringToken, b: ScoringToken): number =>
    a.leaves == b.leaves ? b.points - a.points : b.leaves - a.leaves;

  return (
    <Paper>
      <Box p={2}>
        <Typography variant={"subtitle1"}>Collected Score Tokens</Typography>
        <Divider className={classes.divider} />
        <Grid container spacing={2} direction={"row"}>
          {scoreTokens && scoreTokens.length > 0 ? scoreTokens
            .slice()
            .sort(compareTokens)
            .map((token, index) => (
              <Grid item key={`${token.leaves}-${token.points}-${index}`}>
                <ScoringTokenAvatar token={token} hideScores={hideScores} />
              </Grid>
            )):(
           <Grid item>
             <Typography className={classes.noneText}>None</Typography>
          </Grid>)

          }
        </Grid>
      </Box>
    </Paper>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  divider: {
    marginBottom: theme.spacing(1)
  },
  noneText: {
    color: theme.palette.grey.A200
  }
}));

export default ScoreDisplay;
