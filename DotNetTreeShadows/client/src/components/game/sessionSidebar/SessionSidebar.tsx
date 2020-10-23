import React, {FunctionComponent} from 'react';
import {useDispatch} from 'react-redux';
import HostOptions from "./HostOptions";
import SidebarGrid from "../layout/SidebarGrid";
import {useTypedSelector} from "../../../store";
import GameInfo from "./GameInfo";
import ListTurnOrder from "./ListTurnOrder";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {GameStatus} from "../../../store/game/types/GameStatus";
import TileCodeDecoder from "./TileCodeDecoder";
import Revolutions from "./Revolutions";


interface SessionSidebarProps {
}

//COMPONENT
const SessionSidebar: FunctionComponent<SessionSidebarProps> = (props: SessionSidebarProps) => {
    const {} = props;

    return (
        <SidebarGrid>
            <Revolutions/>
                <ListTurnOrder/>
            <GameInfo/>
            <TileCodeDecoder/>
        </SidebarGrid>
            );
};

const useStyles = makeStyles({
    root: {}
});

export default SessionSidebar;
