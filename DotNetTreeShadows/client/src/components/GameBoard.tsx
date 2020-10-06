import React, { FunctionComponent } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../store';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import DebugToolbar from './DebugToolbar';
import SessionCreator from './SessionCreator';
import { Layout } from '../types/hex-grid/Layout';
import { Orientation } from '../types/hex-grid/Orientation';
import { Point } from '../types/hex-grid/Point';
import BoardTile from './BoardTile';
import {addPieceToHex, removePieceFromHex, fetchBoard } from '../store/board/reducer'

import { Hex } from '../types/hex-grid/Hex';
import {TreeType} from "../types/board/treeType";
import {PieceType} from "../types/board/pieceType";

//REDUX MAPPING
const mapStateToProps = (state: RootState) => {
  return {tiles: state.board.displayTiles};
};

const mapDispatchToProps = {addPiece: (hexCode: number, pieceType: PieceType, treeType: TreeType)=> addPieceToHex({hexCode, pieceType, treeType}), clearPiece: (hexCode:number)=> removePieceFromHex({hexCode})};

//REDUX PROP TYPING
const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

interface IGameBoardProps {}

type GameBoardProps = IGameBoardProps & PropsFromRedux;

//COMPONENT
const GameBoard: FunctionComponent<GameBoardProps> = (props: GameBoardProps) => {
  const classes = useStyles();

  const size = 120;

  const {tiles, addPiece, clearPiece} = props;
  const layout = new Layout(Orientation.Pointy, {x:size,y:size}, {x:1000, y:1000})

  const tileArray : {hexCode: number, pixelCoords: Point, tile: any}[] = [];
  for (let hexName in tiles) {
      const hexCode:number = parseInt(hexName)
     const tile =  tiles[hexCode];
     const hex = new Hex(hexCode);
     const pixelCoords: Point = layout.hexToPixel(hex);
     tileArray.push({hexCode, pixelCoords, tile});
  }

  //TODO: Replace Return below with SVGTreeTile taking tile and position/size data as props.

  return  <div><DebugToolbar/><SessionCreator/><Paper style={{border: '1px solid red', width:800}}>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 2000 2400`}>
    {tiles? tileArray.map(tileEntry=> {
      return <BoardTile hexCode={tileEntry.hexCode} onMouseEnter={(hexCode:number)=>addPiece(hexCode, PieceType.MediumTree, TreeType.Poplar)} onMouseLeave={(hexCode: number)=>clearPiece(hexCode)} size={size} center={tileEntry.pixelCoords}/>;
    }) : ""}</svg>
  </Paper></div>;
};

const useStyles = makeStyles({});

export default connector(GameBoard);
