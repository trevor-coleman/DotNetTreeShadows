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

//REDUX MAPPING
const mapStateToProps = (state: RootState) => {
  return {tiles: state.session.session?.game.board.tiles};
};

const mapDispatchToProps = {};

//REDUX PROP TYPING
const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

interface IGameBoardProps {}

type GameBoardProps = IGameBoardProps & PropsFromRedux;

//COMPONENT
const GameBoard: FunctionComponent<GameBoardProps> = (props: GameBoardProps) => {
  const classes = useStyles();

  const {tiles} = props;
  const layout = new Layout(Orientation.Pointy, {x:130,y:130}, {x:1000, y:1000})

  const tileArray : {pixelCoords: Point, tile: any}[] = [];
  for (let hex in tiles) {
     const tile =  tiles[hex];
     const pixelCoords: Point = layout.hexToPixel(tile.hexCoordinates);
     tileArray.push({pixelCoords, tile});
  }

  console.log(tileArray);


  //TODO: Replace Return below with SVGTreeTile taking tile and position/size data as props.

  return  <div><DebugToolbar/><SessionCreator/><Paper style={{border: '1px solid red', width:800}}>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 2000 2400`}>
    {tiles? tileArray.map(tileEntry=> {
      console.log(tileEntry);
      return <g key={tileEntry.tile.hexCoordinates.toString()}>
        <circle onClick={()=>{console.log(tileEntry.tile.hexCoordinates)}} cx={tileEntry.pixelCoords.x}
                cy={tileEntry.pixelCoords.y}
                r={110}
                fill={"#aca"}
                strokeWidth={5}
                stroke={"#333"} />
        <image href={Sun} x={tileEntry.pixelCoords.x} y={tileEntry.pixelCoords.y} width={50} height={50} />
      </g>;
    }) : ""}</svg>
  </Paper></div>;
};

const useStyles = makeStyles({});

export default connector(GameBoard);
