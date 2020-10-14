import React, {FunctionComponent} from 'react';
import {useDispatch} from 'react-redux';
import {makeStyles, Theme} from '@material-ui/core/styles';
import {useTypedSelector} from "../../../store";
import {List} from "@material-ui/core";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import ListItemText from "@material-ui/core/ListItemText";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import PlayerBoard from "../../../store/game/types/playerBoard";
import TreeAvatarIcon from "../playerSidebar/TreeAvatarIcon";
import Typography from "@material-ui/core/Typography";
import FriendAvatar from "../../FriendAvatar";
import Divider from "@material-ui/core/Divider";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import IconButton from "@material-ui/core/IconButton";
import {showAddPlayerDialog} from "../../../store/appState/reducer";
import AddPlayerDialog from "../AddPlayerDialog";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import DeleteOutlineOutlinedIcon from "@material-ui/icons/DeleteOutlineOutlined";
import {cancelSessionInvite} from "../../../store/signalR/actions";
import {GameStatus} from "../../../store/game/types/GameStatus";
import {updateInvitation} from "../../../store/invitations/thunks";


interface ListTurnOrderProps {
}

//COMPONENT
const ListTurnOrder: FunctionComponent<ListTurnOrderProps> = (props: ListTurnOrderProps) => {
    const {} = props;
    const classes = useStyles();
    const dispatch = useDispatch();
    const {playerBoards, turnOrder, currentTurn, status} = useTypedSelector(state => state.game);
    const {players, host, invitedPlayers, connectedPlayers, id: sessionId} = useTypedSelector(state => state.session);
    const {friends, id: playerId} = useTypedSelector(state => state.profile);
    const {sessionInvites} = useTypedSelector(state => state.invitations);

    const openAddPlayerDialog = () => {
        dispatch(showAddPlayerDialog(true))
    };

    async function cancelInvitation(recipientId: string) {
        const toCancel = sessionInvites.find(inv => inv.resourceId == sessionId && inv.recipientId == recipientId);
        console.log(toCancel);
        if (toCancel) await dispatch(updateInvitation(toCancel, "Cancelled"))
        else console.error(`Could not find invitation for recipient in session:
         Recipient: ${recipientId} 
         Session  : ${sessionId})
         SessionInvites:`, sessionInvites)
    }

    return (
        <Paper>
            <Box p={2}>
                <Typography variant={'subtitle1'}>Turn Order</Typography>
                <Divider/>
                <List>
                    {turnOrder.map((id: string) => {
                        let isConnected = connectedPlayers ? connectedPlayers.indexOf(id) >= 0 : false;
                        return (
                            <ListItem key={id} selected={turnOrder[currentTurn] == id}>
                                <ListItemAvatar>
                                    <TreeAvatarIcon
                                        fontSize={"large"}
                                        active={false}
                                        connected={isConnected}
                                        treeType={PlayerBoard.TreeType(playerBoards[id])}/>
                                </ListItemAvatar>
                                <ListItemText primary={id == playerId ? "You" : players[id]?.name ?? "Player"}
                                              secondary={(isConnected ? "Connected" : "Disconnected") + (id == host ? " - Host" : "")}/>
                            </ListItem>
                        )
                    })}
                    {invitedPlayers.map(id => {
                        return <ListItem key={id} selected={turnOrder[currentTurn] == id}>
                            <ListItemAvatar>
                                <FriendAvatar
                                    fontSize={"large"}
                                    id={id}/>
                            </ListItemAvatar>
                            <ListItemText primary={friends.find(f => f.id == id)?.name ?? "Invited Player"}
                                          secondary={"Invited"}/>
                            {playerId == host ? <ListItemSecondaryAction>
                                <IconButton onClick={() => cancelInvitation(id)}>
                                    <DeleteOutlineOutlinedIcon color={"secondary"}/>
                                </IconButton>
                            </ListItemSecondaryAction> : ""}
                        </ListItem>
                    })}
                    {((turnOrder.length + invitedPlayers.length) < 4) && (playerId == host) && (status == GameStatus.Preparing)
                        ? <ListItem
                            button onClick={openAddPlayerDialog}>
                            <ListItemAvatar><Avatar><PersonAddIcon/></Avatar></ListItemAvatar>
                            <ListItemText primary={"Invite Players"}/>
                        </ListItem> : ""}
                </List>

            </Box>
            <AddPlayerDialog/>
        </Paper>);
};

const useStyles = makeStyles((theme: Theme) => ({
    root: {}
}));

export default ListTurnOrder;
