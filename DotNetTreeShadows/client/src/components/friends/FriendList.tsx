import React, {FunctionComponent} from 'react';
import {useDispatch} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import {Typography} from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import {useTypedSelector} from "../../store";
import ListItem from "@material-ui/core/ListItem";
import List from "@material-ui/core/List";
import Button from "@material-ui/core/Button";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import {FriendProfile} from "../../store/profile/types/friendProfile";
import {removeFriend} from "../../store/profile/thunks";
import {RequestState} from "../../api/requestState";
import { showRemoveFriendConfirmDialog, setFriendToRemove } from '../../store/appState/reducer';
import CardContent from "@material-ui/core/CardContent";
import Card from "@material-ui/core/Card";
import FriendAvatar from "../FriendAvatar";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";


interface FriendListProps {
}

//COMPONENT
const FriendList: FunctionComponent<FriendListProps> = (props: FriendListProps) => {
    const {} = props;
    const classes = useStyles();
    const dispatch = useDispatch();
    const {friends, removingFriendState, removingFriendErrorMessage, lastFriendRemoved} = useTypedSelector(state => state.profile);
    const {showRemoveFriendConfirmDialog: open, friendToRemove} = useTypedSelector(state => state.appState.friendList)
    const handleClickOpen = (friend: FriendProfile) => {
        dispatch(setFriendToRemove(friend))
        dispatch(showRemoveFriendConfirmDialog(true))
    };

    const handleClose = () => {
        dispatch(showRemoveFriendConfirmDialog(false))
    };

    function handleRemoveFriend(friendToRemove: FriendProfile | null) {
        if(friendToRemove == null) return;
        dispatch(removeFriend(friendToRemove.id))
    }

    const normal = friendToRemove && (lastFriendRemoved != friendToRemove.id && removingFriendState == RequestState.Idle)

    return (
        <Card className={classes.root}><CardContent>
            <Typography>Friends</Typography>
            <Divider/>
            <List>
                {friends.map(f => <ListItem key={f.id}>
                <ListItemAvatar>
                    <FriendAvatar id={f.id}/>
                </ListItemAvatar>
                    <ListItemText>{f.name}</ListItemText>
                <ListItemSecondaryAction>
                        <Button variant={"outlined"} color={"secondary"} size={"small"}
                                onClick={() => handleClickOpen(f)}>Remove
                        </Button>
                    </ListItemSecondaryAction>
                </ListItem>)}
            </List>
            <Dialog open={open}>
                <DialogTitle>Remove {friendToRemove?.name ?? "friend"}?</DialogTitle>
                {removingFriendState == RequestState.Pending ? <DialogTitle>Removing</DialogTitle>:""}
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={()=>handleRemoveFriend(friendToRemove)} color="secondary" autoFocus>
                        Remove Friend
                    </Button>
                </DialogActions>
            </Dialog>
        </CardContent>
        </Card>);
};

const useStyles = makeStyles({
    root:{}
});

export default FriendList;
