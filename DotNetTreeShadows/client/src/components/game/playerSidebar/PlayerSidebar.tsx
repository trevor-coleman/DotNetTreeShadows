import React from 'react';
import PlayerBoardDisplay from './PlayerBoardDisplay';
import SidebarGrid from "../layout/SidebarGrid";
import AvailablePieces from "./AvailablePieces";
import ScoreDisplay from './ScoreDisplay';

const PlayerSidebar = () => {
  return <div>
    <SidebarGrid>
    <PlayerBoardDisplay/>
    <AvailablePieces/>
      <ScoreDisplay/>
    </SidebarGrid>

  </div>
}

export default PlayerSidebar;
