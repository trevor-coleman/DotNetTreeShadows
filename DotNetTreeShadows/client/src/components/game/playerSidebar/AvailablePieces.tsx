import React, { FunctionComponent } from "react";
import { useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import { useTypedSelector } from "../../../store";
import PlayerBoard from "../../../store/game/types/playerBoard";
import { PieceType } from "../../../store/board/types/pieceType";
import TreeAvatarIcon from "./TreeAvatarIcon";
import Grid from "@material-ui/core/Grid";
import CollapsingBox from "../../CollapsingBox";
import { usePlayerId } from '../../../store/profile/reducer';
import { useSelectPlayerBoard } from '../../../store/playerBoard/reducer';

interface Props {
  width?: number;
  id?: string|null
}

//COMPONENT
const AvailablePieces: FunctionComponent<Props> = (props: Props) => {
  const classes = useStyles(props);
  const dispatch = useDispatch();
  const playerId = props.id ?? usePlayerId();
  const playerBoard = useSelectPlayerBoard(playerId)

  const available: number[] = playerId ? [
      playerBoard.pieces.Seed.available,
      playerBoard.pieces.SmallTree.available,
      playerBoard.pieces.MediumTree.available,
      playerBoard.pieces.LargeTree.available,
    ] : [];

  const availablePieces: { pieceType: PieceType; key: string }[][] = [];

  available.forEach((numberOfPieces, pieceType) => {
    let pieces = [];
    for (let i = 0; i < numberOfPieces; i++) {
      pieces.push({
        pieceType: pieceType as PieceType,
        key: `${playerId}-${pieceType}-${i}`
      });
    }
    availablePieces[pieceType] = pieces;
  });
  let lastPiece: { pieceType: PieceType; key: string };

  return (
    <CollapsingBox title="Available Pieces">
      <Grid direction={"column"} container>
        {availablePieces.map((pieces, index) => {
          return (
            <div key={PieceType[index]}>
              <Grid item container>
                {pieces.map(piece => {
                  return (
                    <Grid item key={piece.key}>
                      <Box m={0.5}>
                        <TreeAvatarIcon
                          pieceType={piece.pieceType}
                          treeType={playerBoard.treeType}
                          fontSize={"large"}
                        />
                      </Box>
                    </Grid>
                  );
                })}
              </Grid>
            </div>
          );
        })}
      </Grid>
    </CollapsingBox>
  );
};

const useStyles = makeStyles({
  root: {
    width: (props: Props) => props.width ?? 250
  },
  pieceWrapper: {
    display: ""
  },
  pieceTypeName: {
    display: "block",
    color: "lightgrey"
  },
  divider: {
    marginTop: 4,
    marginBottom: 4,
    display: "block"
  }
});

export default AvailablePieces;
