import SVGTreeToken, { TokenInfo } from './SVGTreeToken';
import Paper from '@material-ui/core/Paper';
import React, { useState } from 'react';
import { PieceType, TreeType } from '../store/sessions/types';
import Button from '@material-ui/core/Button';
import Sun from '../svg/sun-svgrepo-com.svg';
import GameBoard from './GameBoard';



const TreeTokenTest = () => {

  const [state, setState] = useState({
    pieceIndex: 0,
    treeIndex: 0,
    sun: false,
    sky: false,
    shaded: false,
  });

  const pieceTypes: PieceType[] = ["Seed", "SmallTree", "MediumTree", "LargeTree"];
  const treeTypes: TreeType[] = ["Ash", "Aspen", "Poplar", "Birch"];

  const nextPiece = () => {
    setState({
      ...state,
      sky: false,
      pieceIndex: (
                    state.pieceIndex + 1) % pieceTypes.length,
    });
  };
  const nextTree = () => {
    setState({
      ...state,
      sky: false,
      treeIndex: (
                   state.treeIndex + 1) % treeTypes.length,
    });
  };
  const toggleSun = () => setState({
    ...state,
    sun: !state.sun,
  });

  const toggleShade = () => setState({
    ...state,
    shaded: !state.shaded,
  });

  const toggleSky = () => setState({
    ...state,
    sky: !state.sky,
  });

  const skyInfo: TokenInfo = {
    tokenType: 'Sky',
    sun: state.sun,
  };

  const groundInfo: TokenInfo = {
    pieceType: pieceTypes[state.pieceIndex],
    shaded: state.shaded,
    treeType: treeTypes[state.treeIndex],
    tokenType: 'Ground',
  };

  return (
    <div>
      <Paper>
        <Button onClick={nextPiece}>Piece</Button>{' '}
        <Button onClick={nextTree}>Tree</Button>{' '}
        <Button onClick={toggleSky}>Sky</Button>{' '}
        <Button disabled={!state.sky} onClick={toggleSun}>Sun</Button>
        <Button disabled={state.sky} onClick={toggleShade}>Shade</Button>
      </Paper>
      <Paper>
        {/*<SVGTreeToken info={state.sky? skyInfo : groundInfo}  size={100} onClick={()=>console.log("click")}/>*/}
        {state.sky ? `Sky ${state.sun? "with sun" : ""}` : `${treeTypes[state.treeIndex]} - ${pieceTypes[state.pieceIndex]} - ${state.shaded ? 'Shaded' : "Sunny"}`}
          </Paper>

          </div>)
          }

          export default TreeTokenTest;
