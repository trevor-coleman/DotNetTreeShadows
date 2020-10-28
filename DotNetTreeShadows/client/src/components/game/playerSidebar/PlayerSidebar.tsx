import React from 'react';
import PlayerBoardDisplay from './PlayerBoardDisplay';
import SidebarGrid from "../layout/SidebarGrid";
import AvailablePieces from "./AvailablePieces";
import ScoreDisplay from './ScoreDisplay';
import { useCollectedScoreTokens } from '../../../store/game/reducer';

const PlayerSidebar = () => {
  const scoreTokens = useCollectedScoreTokens();

  return <div>
    <SidebarGrid>
      <AvailablePieces/>
      <PlayerBoardDisplay/>
      {scoreTokens?.length > 0 ? <ScoreDisplay/>:""}
    </SidebarGrid>
  </div>
}

export default PlayerSidebar;
