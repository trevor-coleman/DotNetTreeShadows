import React, {FunctionComponent} from 'react';
import {useDispatch} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import ListTurnOrder from "./ListTurnOrder";
import GameInfoDisplay from "./GameInfoDisplay";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import SidebarGrid from "../SidebarGrid";


interface SessionSidebarProps {
}

//COMPONENT
const SessionSidebar: FunctionComponent<SessionSidebarProps> = (props: SessionSidebarProps) => {
    const {} = props;
    const classes = useStyles();
    const dispatch = useDispatch();

    return (
        <SidebarGrid>
                <GameInfoDisplay/>
                <ListTurnOrder/>
        </SidebarGrid>
            );
};

const useStyles = makeStyles({
    root: {}
});

export default SessionSidebar;
