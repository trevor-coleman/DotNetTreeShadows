import React from 'react';
import PlayerBoardDisplay from './PlayerBoardDisplay';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import TurnActionButtons from './TurnActionButtons';
import AvailablePieces from "./AvailablePieces";

const GameSidebar = () => {
  return <div>
    <TurnActionButtons/>
    <Divider/>
    <PlayerBoardDisplay width={250}/>

  </div>
}

export default GameSidebar;
