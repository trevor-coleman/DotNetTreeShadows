import React, {FunctionComponent} from 'react';
import SidebarGrid from "../layout/SidebarGrid";
import GameInfo from "./GameInfo";
import ListTurnOrder from "./ListTurnOrder";
import makeStyles from "@material-ui/core/styles/makeStyles";
import TileCodeDecoder from "./TileCodeDecoder";
import Revolutions from "./Revolutions";
import ScoreTokenPiles from './ScoreTokenPiles';
import ActionHistory from './ActionHistory';


interface SessionSidebarProps {
}

//COMPONENT
const SessionSidebar: FunctionComponent<SessionSidebarProps> = (props: SessionSidebarProps) => {
    const {} = props;

    return (
        <SidebarGrid>
            <Revolutions/>
          <ListTurnOrder/>
          <ScoreTokenPiles/>
          <ActionHistory/>
            <GameInfo/>
        </SidebarGrid>
            );
};

const useStyles = makeStyles({
    root: {}
});

export default SessionSidebar;
