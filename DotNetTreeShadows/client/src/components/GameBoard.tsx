import React, { FunctionComponent } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../store';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Sun from '../svg/sun-svgrepo-com.svg';
import DebugToolbar from './DebugToolbar';
import SessionCreator from './SessionCreator';
import { Layout } from '../models/hex-grid/Layout';
import { Orientation } from '../models/hex-grid/Orientation';
import { Point } from '../models/hex-grid/Point';
import BoardTile from './BoardTile';
import { Tile, TreeType, PieceType } from '../store/sessions/types';
import { addPieceToHex, clearPieceFromHex } from '../store/board/actions';
import { HexCoordinates } from '../models/hex-grid/HexCoordinates';

//REDUX MAPPING
const mapStateToProps = (state: RootState) => {
  return {tiles: state.session.session?.game.board.tiles};
};

const mapDispatchToProps = {addPiece:addPieceToHex(), clearPiece: clearPieceFromHex};

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

  const tileArray : {pixelCoords: Point, tile: any}[] = [];
  for (let hex in tiles) {
     const tile =  tiles[hex];
     const pixelCoords: Point = layout.hexToPixel(tile.hexCoordinates);
     tileArray.push({pixelCoords, tile});
  }

  //TODO: Replace Return below with SVGTreeTile taking tile and position/size data as props.

  return  <div><DebugToolbar/><SessionCreator/><Paper style={{border: '1px solid red', width:800}}>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 2000 2400`}>
    {tiles? tileArray.map(tileEntry=> {
      return <BoardTile onMouseEnter={(tile:Tile)=>addPiece(tile.hexCoordinates, "MediumTree", "Poplar")} onMouseLeave={(tile:Tile)=>clearPiece(tile.hexCoordinates)} size={size}  tile={tileEntry.tile} center={tileEntry.pixelCoords}/>;
    }) : ""}</svg>
  </Paper></div>;
};

const useStyles = makeStyles({});

export default connector(GameBoard);
