import React, {FunctionComponent} from 'react';
import {useDispatch} from 'react-redux';
import {Box, Paper} from "@material-ui/core";
import {useTypedSelector} from "../../store";
import WrappedBoardTile from "./WrappedBoardTile";
import {PieceType} from "../../store/board/types/pieceType";
import PlayerBoard from "../../store/game/types/playerBoard";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import IconButton from "@material-ui/core/IconButton";
import AddPlayerDialog from "./AddPlayerDialog";
import FriendAvatar from "../FriendAvatar";
import TreeAvatarIcon from "../TreeAvatarIcon";

interface GameInfoBarProps {
}

//COMPONENT
const GameInfoBar: FunctionComponent<GameInfoBarProps> = (props: GameInfoBarProps) => {
    const {} = props;
    const classes = useStyles();
    const dispatch = useDispatch();
    const {playerBoards, turnOrder, currentTurn} = useTypedSelector(state => state.game)
    const {players, host, invitedPlayers} = useTypedSelector(state=> state.session);
    const {id:playerId, friends} = useTypedSelector(state=> state.profile);


    return (
        <Box m={1} className={classes.root}>
            <Paper>
                <Box p={1}>
            <Grid container alignItems={"center"}>
                <Grid item xs={2}>
                    <Typography align={"center"}>Turn Order</Typography>
                </Grid>

                {turnOrder.map((id:string)=>(
                    <Grid item xs={1} key={id}>
                        <Grid container alignItems={"center"} direction={"column"}>
                        <Grid item className={classes.turnOrderIcon}><div className={classes.boardTile}><TreeAvatarIcon active={false} treeType={PlayerBoard.TreeType(playerBoards[id])}/></div></Grid>
                        <Grid item><Typography variant={"caption"} align={"center"} className={classes.playerLabel}>{players[id]?.name??"Invited Player"}</Typography></Grid></Grid>
                    </Grid>))}
                {invitedPlayers.map(id=> <Grid item xs={1} key={id}>
                    <Grid container alignItems={"center"} direction={"column"}>
                        <Grid item className={classes.turnOrderIcon}><div className={classes.boardTile}><FriendAvatar id={id}/></div></Grid>
                        <Grid item><Typography variant={"caption"} align={"center"} className={classes.playerLabel}>{friends.find(f=>f.id==id)?.name ?? "player"}</Typography></Grid></Grid>
                </Grid>)}
                {(turnOrder.length + invitedPlayers.length) < 4 && playerId == host  ? <Grid item xs={1} >
                    <Grid container alignItems={"center"} direction={"column"}>
                        <Grid item><div className={classes.turnOrderIcon}><div className={classes.addPlayerButton}><IconButton><PersonAddIcon/></IconButton></div></div></Grid>
                        <Grid item><Typography variant={"caption"} align={"center"} className={classes.playerLabel}>Add Player</Typography></Grid></Grid>
                </Grid> :<div/>}
            </Grid>
                </Box>
            </Paper>
            <AddPlayerDialog/>
        </Box>);
};

const useStyles = makeStyles({
    root: {},
    playerLabel: {height: "2em", fontSize:"0.75rem"},
    boardTile:{
        position:"absolute",
        top:"50%",
        left: "50%",
        transform:"translate(-50%,-50%)",
        width: 48,
        height: 48
    },
    turnOrderIcon: {
        position: "relative",
        margin:8,
        width: 64,
        height: 64,
    },
    addPlayerButton:{
        position:"absolute",
        top:"50%",
        left: "50%",
        transform:"translate(-50%,-50%)",
        width: 48,
        height: 48,
        borderRadius:100,
        border: "1px dashed lightgrey"
    },
    turnOrderPiece: {display: "block", alignItems: 'center', border:"1px solid green"},
});

export default GameInfoBar;
