import React, { FunctionComponent } from "react";
import { useDispatch } from "react-redux";
import { makeStyles, Theme, useTheme } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import {
  DialogContent, ListItem, DialogActions, Button, Typography,
} from "@material-ui/core";
import List from "@material-ui/core/List";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import ListItemText from "@material-ui/core/ListItemText";
import { useGameStatus, useScores } from "../../../../store/game/reducer";
import { GameStatus } from "../../../../store/game/types/GameStatus";
import { usePlayers } from "../../../../store/session/reducer";
import { ScoringToken } from "../../../../store/game/types/scoringToken";
import { useIsHost } from "../../../../store/profile/reducer";
import { Link } from "react-router-dom";
import { useTypedSelector } from "../../../../store";
import treeColor from "../../../helpers/treeColor";
import Grid from "@material-ui/core/Grid";
import ScoringTokenAvatar from "../../playerSidebar/ScoringTokenAvatar";
import Emoji from "a11y-react-emoji";
import Color from "color";
import EmojiAward from './EmojiAward';
import ScoreSummaryRow from './ScoreSummaryRow';

export interface ScoreDisplayInfo {
  id: string;
  totalScore: number;
  lightPoints: number;
  tokens: ScoringToken[];
}

interface GameOverDialogProps {}

//COMPONENT
const GameOverDialog: FunctionComponent<GameOverDialogProps> = (
  props: GameOverDialogProps
) => {
  const {} = props;
  const theme = useTheme();
  const classes = useStyles();
  const dispatch = useDispatch();
  const status = useGameStatus();
  const playerBoards = useTypedSelector(state => state.playerBoards);
  const scores = useScores();
  const players = usePlayers();
  const isHost = useIsHost();
  const open = status == GameStatus.Ended;



  const scoreDisplay: {
    id: string;
    totalScore: number;
    lightPoints: number;
    tokens: ScoringToken[];
  }[] = [];

  Object.keys(scores).forEach(id => {
    if (!players[id]) return;
    let totalScore = scores[id].reduce(
      (acc: number, curr) => acc + curr.points,
      0
    );
    const lightPoints = Math.floor(playerBoards[id].light / 3);
    totalScore += lightPoints;

    scoreDisplay.push({
      id,
      totalScore,
      lightPoints,
      tokens: [...scores[id]].sort((a, b) => b.points - a.points)
    });
  });

  scoreDisplay.sort((a, b) => {
    return b.totalScore - a.totalScore;
  });

  return (
    <div>
      <Dialog
        open={open}
        aria-labelledby="form-dialog-title"
        maxWidth={"sm"}
        fullWidth={true}
      >
        <DialogTitle id="form-dialog-title">
          <Typography variant={"h4"}>Congratulations {scoreDisplay[0] ? players[scoreDisplay[0].id].name : "winner"}!</Typography>
        </DialogTitle>
        <DialogContent>
          <List>
            {scoreDisplay.map((info, index) => {
              const color: Color<string> = new Color(
                treeColor(playerBoards[info.id].treeType)
              );
              return (
                <ScoreSummaryRow key={`score-summary-row-${info.id}`} info={info} index={index}/>
              );
            })}
          </List>
        </DialogContent>
        <DialogActions>
          <Button component={Link} to={"/sessions"}>
            Exit Session
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  name: {textTransform: "capitalize"}
}));

export default GameOverDialog;
