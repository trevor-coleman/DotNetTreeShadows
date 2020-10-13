import React, {FunctionComponent} from 'react';
import {useDispatch} from 'react-redux';
import {makeStyles, Theme} from '@material-ui/core/styles';
import Grid from "@material-ui/core/Grid";
import TreeAvatarIcon from "./TreeAvatarIcon";
import PlayerBoard from "../../store/game/types/playerBoard";
import Typography from "@material-ui/core/Typography";
import FriendAvatar from "../FriendAvatar";
import IconButton from "@material-ui/core/IconButton";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import {useTypedSelector} from "../../store";
import {showAddPlayerDialog} from "../../store/appState/reducer";
import {Paper, Box} from "@material-ui/core";
import AddPlayerDialog from "./AddPlayerDialog";
import CenteredDiv from "../CenteredDiv";


interface TurnOrderProps {
}

//COMPONENT
const TurnOrder: FunctionComponent<TurnOrderProps> = (props: TurnOrderProps) => {
    const {} = props;
    const classes = useStyles();
    const dispatch = useDispatch();
    const {playerBoards, turnOrder} = useTypedSelector(state => state.game);
    const {players, host, invitedPlayers, connectedPlayers} = useTypedSelector(state => state.session);
    const {friends, id: playerId} = useTypedSelector(state => state.profile);


    const openAddPlayerDialog = () => {
        dispatch(showAddPlayerDialog(true))
    };

const gridWidth = 3;

    return (
        <Paper className={classes.root}>
            <Box p={2}>
                <Grid container direction={"row"} className={classes.gridRoot} spacing={3}>
                    {turnOrder.map((id: string) => {
                        let isConnected = connectedPlayers ? connectedPlayers.indexOf(id) >= 0 : false;
                        let height = 64;
                        return <Grid item key={id} xs={gridWidth} className={classes.iconGridItem}>
                            <CenteredDiv height={height} width={96}>
                                <TreeAvatarIcon
                                    fontSize={"large"}
                                    size={56}
                                    active={false}
                                                connected={isConnected}
                                                treeType={PlayerBoard.TreeType(playerBoards[id])}/>

                            </CenteredDiv>
                            <Typography variant={"caption"} align={"center"} className={classes.playerLabel}>{id == playerId ? "You" : players[id].name}</Typography>
                        </Grid>
                    })}

                    {invitedPlayers.map(id =>
                        (<Grid item key={id} xs={gridWidth} className={classes.iconGridItem}>
                            <CenteredDiv height={64} width={96}>
                                <FriendAvatar
                                    fontSize={"large"}
                                    size={56}
                                    id={id}/>
                            </CenteredDiv>
                            <Typography variant={"caption"} align={"center"} className={classes.playerLabel}>{players[id].name}</Typography>
                        </Grid>))}
                    {(turnOrder.length + invitedPlayers.length) < 4 && playerId == host
                        ? <Grid item xs={gridWidth} className={classes.iconGridItem}>
                            <CenteredDiv height={64} width={96}>
                                <div className={classes.addPlayerButton}><IconButton
                                    onClick={openAddPlayerDialog}>
                                    <PersonAddIcon/>
                                </IconButton></div>
                            </CenteredDiv>
                            <Typography variant={"caption"} align={"center"} className={classes.playerLabel}>Add Player</Typography>
                        </Grid>
                             : ""}
                </Grid>
            </Box>
            <AddPlayerDialog/>
        </Paper>);
};

const useStyles = makeStyles((theme:Theme)=> ({
    root: {
    },
    gridRoot: {
        height: "fit-content",
    },
    playerLabel: {
        height: "2em",
        fontSize: "0.75rem",
        display: "block",
        width: 96,
    },
    addPlayerButton: {
        width: 48,
        height: 48,
        borderRadius: 100,
        border: "1px dashed lightgrey"
    },
    iconGridItem: {
        padding: theme.spacing(2)
    },


}));


export default TurnOrder;
