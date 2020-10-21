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


interface SessionSidebarProps {
}

//COMPONENT
const SessionSidebar: FunctionComponent<SessionSidebarProps> = (props: SessionSidebarProps) => {
    const {} = props;
    const classes = useStyles();
    const dispatch = useDispatch();
    const {id: playerId} = useTypedSelector(state => state.profile);
    const {host} = useTypedSelector(state => state.session);
    const {status} = useTypedSelector(state => state.game);


    const showHostOptions = (playerId == host) && (status == GameStatus.Preparing);
    return (
        <SidebarGrid>
                <ListTurnOrder/>
            {showHostOptions ? <HostOptions/> : <GameInfo/>}
            <TileCodeDecoder/>
        </SidebarGrid>
            );
};

const useStyles = makeStyles({
    root: {}
});

export default SessionSidebar;