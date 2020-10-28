import PlayerBoard, {PieceDetails} from "../../../store/game/types/playerBoard";
import { Grid, Typography } from "@material-ui/core";
import { PieceType, pieceTypeName } from "../../../store/board/types/pieceType";
import React, {useState} from "react";
import {makeStyles} from '@material-ui/core/styles';
import TreeAvatarIcon from "./TreeAvatarIcon";
import {useTypedSelector} from "../../../store";
import {GameActionType} from "../../../store/game/actions";
import handlePlayerBoardClick from "../../../store/game/gameActions/handlePlayerBoardClick";
import {usePlayerId} from "../../../store/profile/reducer";
import {useLight, useSelectPlayerBoard} from "../../../store/playerBoard/reducer";
import treeColor from '../../helpers/treeColor';

interface Props {
  index: number,
  col: PieceDetails[],
  size: number
  id?: string
  disableMouseEvents?: boolean
}

const PiecesGrid = (props: Props) => {
  const {index, col, size} = props
  const classes = useStyles(props)
  const [hoverKey, setHoverKey] = useState("")
  const playerId = props.id ?? usePlayerId();
  const currentActionType = useTypedSelector(state => state.game.currentActionType);
  const playerBoard = useSelectPlayerBoard(playerId);
  const pieceType = index as PieceType;
  const light = useLight();


  return (
    <Grid container item direction={"column"} spacing={1}>
      <Grid item>
        <TreeAvatarIcon treeType={playerBoard.treeType} pieceType={pieceType} />
        <Typography variant={"caption"} align={"center"}>{pieceTypeName(pieceType)}</Typography>
      </Grid>
      {col.map(({ status, price, key }: PieceDetails, pieceIndex) => {
        const pieces = playerBoard.pieces[PieceType[pieceType]];
        const highlight =
          currentActionType == GameActionType.Buy &&
          pieceIndex == pieces.onPlayerBoard - 1 &&
          pieces.nextPrice <= light;
        return (
          <Grid
            item
            className={classes.gridItem}
            key={key}
            onMouseEnter={() => {
              if (!props.disableMouseEvents) setHoverKey(key);
            }}
            onClick={e => {
              if (!highlight) return;
              handlePlayerBoardClick(pieceType);
            }}
            onMouseLeave={() => {
              if (!props.disableMouseEvents) setHoverKey("");
            }}
          >
            <TreeAvatarIcon
              treeType={playerBoard.treeType}
              highlight={highlight}
              text={price}
              empty={status == "Empty"}
              pieceType={pieceType}
              fontSize={"large"}
            />
          </Grid>
        );
      })}
    </Grid>
  );
}

const useStyles = makeStyles({
  root: {},
  gridItem: {
    height: 50,
  },
  piece: {
    width: 50
  }
})


export default PiecesGrid;
