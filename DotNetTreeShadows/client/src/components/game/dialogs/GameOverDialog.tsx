import React, { FunctionComponent } from "react";
import { useDispatch } from "react-redux";
import { makeStyles, Theme, useTheme } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import {
  DialogContent,
  ListItem,
  DialogActions,
  Button
} from "@material-ui/core";
import DialogContentText from "@material-ui/core/DialogContentText";
import List from "@material-ui/core/List";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import ListItemText from "@material-ui/core/ListItemText";
import { useGameStatus, useScores } from "../../../store/game/reducer";
import { GameStatus } from "../../../store/game/types/GameStatus";
import { usePlayers } from "../../../store/session/reducer";
import { ScoringToken } from "../../../store/game/types/scoringToken";
import { useIsHost } from "../../../store/profile/reducer";
import { Link } from "react-router-dom";
import TreeAvatarIcon from "../playerSidebar/TreeAvatarIcon";
import { useTypedSelector } from "../../../store";
import treeColor from "../../helpers/treeColor";
import ListSubheader from '@material-ui/core/ListSubheader';
import Divider from '@material-ui/core/Divider';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

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
    name: string;
    totalScore: number;
    tokens: ScoringToken[];
  }[] = [];

  Object.keys(scores).forEach(id => {
    if (!players[id]) return;
    scoreDisplay.push({
      id,
      name: players[id].name,
      totalScore: scores[id].reduce(
        (acc: number, curr) => acc + curr.points,
        0
      ),
      tokens: [...scores[id]].sort((a, b) => b.points - a.points)
    });
  });

  scoreDisplay.sort((a, b) => {
    return b.totalScore - a.totalScore;
  });

  return (
    <div>
      <Dialog open={open} aria-labelledby="form-dialog-title" maxWidth="xs" fullWidth={true}>
        <DialogTitle id="form-dialog-title">Congratulations {scoreDisplay[0]?.name ?? "winner"}!</DialogTitle>
        <DialogContent>
        <List>
              {scoreDisplay.map((info, index) => (
                <ListItem
                  key={info.id}
                  style={{
                    border: index === 0 ? "1px dashed green" : ""
                  }}
                >
                  <ListItemAvatar>
                    <Avatar
                      variant={"rounded"}
                      style={{
                        color: theme.palette.getContrastText(
                          treeColor(playerBoards[info.id].treeType)
                        ),
                        backgroundColor: treeColor(
                          playerBoards[info.id].treeType
                        )
                      }}
                    >
                      {info.totalScore}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={info.name}
                    primaryTypographyProps={{
                      variant: "h6",
                      color: "textPrimary"
                    }}
                  />
                </ListItem>
              ))}
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
  root: {}
}));

export default GameOverDialog;
