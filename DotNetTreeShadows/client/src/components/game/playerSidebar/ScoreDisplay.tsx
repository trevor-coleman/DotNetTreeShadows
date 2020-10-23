import React, { FunctionComponent } from "react";
import { useDispatch } from "react-redux";
import { makeStyles, Theme } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import { Typography, Avatar } from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import Paper from "@material-ui/core/Paper";
import { useScoreTokens } from '../../../store/game/reducer';

interface ScoreDisplayProps {}

//COMPONENT
const ScoreDisplay: FunctionComponent<ScoreDisplayProps> = (
  props: ScoreDisplayProps
) => {
  const {} = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const scoreTokens = useScoreTokens();

  return (
    <Paper>
      <Box p={2}>
        <Typography variant={"subtitle1"}>Score Tokens</Typography>
        <Divider className={classes.divider} />
        {scoreTokens.map(token=><Avatar>{`${token.points}`}</Avatar>)}
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
