import React from 'react';
import PlayerBoardDisplay from './PlayerBoardDisplay';
import SidebarGrid from "../layout/SidebarGrid";
import AvailablePieces from "./AvailablePieces";

const PlayerSidebar = () => {
  return <div>
    <SidebarGrid>
    <PlayerBoardDisplay/>
    <AvailablePieces/>
    </SidebarGrid>

  </div>
}

export default PlayerSidebar;
