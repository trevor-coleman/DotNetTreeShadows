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

interface ScoreDisplayProps {}

//COMPONENT
const ScoreDisplay: FunctionComponent<ScoreDisplayProps> = (
  props: ScoreDisplayProps
) => {
  const {} = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const scoreTokens = useCollectedScoreTokens();
  const hideScores = false;

  interface TokenProps {
    token: { leaves: number; points: number };
    hideScores?: boolean;
  }

  const ScoringTokenAvatar = (props: TokenProps) => {
    const { token } = props;
    const hideScores = props.hideScores ?? false;
    const [open, setOpen] = useState(false);
    const visible = hideScores ? open : true;

    return (
      <Avatar
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        style={{
          backgroundColor: tileColor(4 - token.leaves),
          color: "#fff",
          cursor: "default"
        }}
      >
        {visible ? `${token.points}` : " "}
      </Avatar>
    );
  };

  const compareTokens = (a: ScoringToken, b: ScoringToken): number =>
    a.leaves == b.leaves ? b.points - a.points : b.leaves - a.leaves;

  return (
    <Paper>
      <Box p={2}>
        <Typography variant={"subtitle1"}>Collected Score Tokens</Typography>
        <Divider className={classes.divider} />
        <Grid container spacing={2} direction={"row"}>
          {scoreTokens
            .slice()
            .sort(compareTokens)
            .map((token, index) => (
              <Grid item key={`${token.leaves}-${token.points}-${index}`}>
                <ScoringTokenAvatar token={token} hideScores={hideScores} />
              </Grid>
            ))}
        </Grid>
        {hideScores && scoreTokens.length > 0 ? (
          <Typography variant={"caption"}>Hover to see score</Typography>
        ) : (
          ""
        )}
      </Box>
    </Paper>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  divider: {
    marginBottom: theme.spacing(1)
  }
}));

export default ScoreDisplay;
