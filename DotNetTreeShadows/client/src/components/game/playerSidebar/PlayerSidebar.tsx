import React from 'react';
import PlayerBoardDisplay from './PlayerBoardDisplay';
import SidebarGrid from "../layout/SidebarGrid";
import AvailablePieces from "./AvailablePieces";
import ScoreDisplay from './ScoreDisplay';
import { useCollectedScoreTokens } from '../../../store/game/reducer';
import ActionInformation from '../bottomBar/ActionInformation';

const PlayerSidebar = () => {
  const scoreTokens = useCollectedScoreTokens();

  return <div>
    <SidebarGrid>
      <AvailablePieces/>
      <PlayerBoardDisplay/>
      <ScoreDisplay/>
      <ActionInformation/>
    </SidebarGrid>
  </div>
}

export default PlayerSidebar;
