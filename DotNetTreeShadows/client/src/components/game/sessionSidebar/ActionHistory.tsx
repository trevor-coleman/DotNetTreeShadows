import React, { FunctionComponent, useState } from "react";
import { useDispatch } from "react-redux";
import { makeStyles, Theme } from "@material-ui/core/styles";
import CollapsingBox from "../../CollapsingBox";
import { useActionHistoryData } from "../../../store/game/reducer";
import { GameActionType } from "../../../store/game/actions";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import TreeAvatarIcon from "../playerSidebar/TreeAvatarIcon";
import { Box } from "@material-ui/core";
import ListItemText from "@material-ui/core/ListItemText";
import { PieceType, pieceTypeName } from "../../../store/board/types/pieceType";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import useTheme from "@material-ui/core/styles/useTheme";
import {
  useBoard,
  focusTiles,
  unfocusTiles
} from "../../../store/board/reducer";

interface ActionHistoryProps {}

//COMPONENT
const ActionHistory: FunctionComponent<ActionHistoryProps> = (
  props: ActionHistoryProps
) => {
  const {} = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const theme = useTheme();
  const { actionHistory, players, playerBoards } = useActionHistoryData();
  const board = useBoard();
  const [hoverItem, setHoverItem] = useState();

  const history = actionHistory.slice().reverse();

  const TurnSeparator = ({ playerId }: { playerId: string }) => (
    <>
      {" "}
      <li>
        <Typography
          className={classes.dividerFullWidth}
          color="textSecondary"
          display="block"
          variant="caption"
        >
          {players[playerId]?.name}
        </Typography>
      </li>
      <Divider component="li" className={classes.dividerLine} />
    </>
  );
  return (
    <CollapsingBox title={"Action History"}>
      <Box maxHeight={250} className={classes.scrollContainer}>
        <List>
          {history.map(({actionType, id, origin, pieceType: actionPieceType, playerId, target}, index) => {

            let pieceType;
            switch (actionType) {
              case GameActionType.Grow:
              case GameActionType.Buy:
                pieceType = actionPieceType;
                break;
              case GameActionType.Plant:
                pieceType = PieceType.Seed;
                break;
              case GameActionType.Collect:
                pieceType = PieceType.LargeTree;
                break;
              default:
                pieceType = PieceType.SmallTree;
            }

            const tilesToFocus: number[] = [];
            if (origin) tilesToFocus.push(origin);
            if (target) tilesToFocus.push(target);

            if (
              actionType == GameActionType.EndTurn &&
              index + 1 < history.length &&
              history[index + 1].actionType == GameActionType.EndTurn
            ) {
              return (
                <div key={id}>
                  <TurnSeparator playerId={playerId} />
                  <ListItem dense disabled>
                    <ListItemText primary={"No action"} color={"red"} />
                  </ListItem>
                </div>
              );
            }
            return actionType == GameActionType.EndTurn ? (
              <TurnSeparator key={id} playerId={playerId} />
            ) : (
              <div key={id}>
                {index == 0 ? <TurnSeparator playerId={playerId} /> : null}
                <ListItem
                  dense
                  selected={(!!origin && id==hoverItem)}
                  onMouseEnter={() => {
                    setHoverItem(id);
                    return dispatch(focusTiles(tilesToFocus));
                  }}
                  onMouseLeave={() => {
                    setHoverItem(null);
                    return dispatch(unfocusTiles(tilesToFocus));
                  }}
                >
                  <ListItemAvatar className={classes.actionHistoryIcon}>
                    <TreeAvatarIcon
                        fontSize={"large"}
                        active={false}
                        treeType={playerBoards[playerId].treeType}
                        pieceType={pieceType ?? PieceType.SmallTree}
                    />
                  </ListItemAvatar>
                  <ListItemText primary={GameActionType[actionType!]} secondary={pieceType ? pieceTypeName(pieceType, true):undefined} />
                </ListItem>
              </div>
            );
          })}
        </List>
      </Box>
    </CollapsingBox>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  scrollContainer: {
    overflow: "scroll"
  },
  dividerFullWidth: {
    margin: `5px 0 0 ${theme.spacing(2)}px`
  },
  dividerLine: {
    marginLeft: theme.spacing(2)
  },
  actionHistoryIcon: {
    width: "48",
    height: "48"
  }
}));

export default ActionHistory;
