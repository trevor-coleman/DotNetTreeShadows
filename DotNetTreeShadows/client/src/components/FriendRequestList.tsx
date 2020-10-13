import React, {FunctionComponent} from 'react';
import {useDispatch} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import CancelIcon from "@material-ui/icons/Cancel";
import {useTypedSelector} from "../store";
import {updateInvitation} from "../store/invitations/actions";
import {Invitation} from "../store/invitations/types/invitation";
import {CardContent} from "@material-ui/core";
import Card from "@material-ui/core/Card";
import {formatDistanceToNow} from "date-fns";



interface FriendRequestListProps {
    type: "sent" | "received"
}

//COMPONENT
const FriendRequestList: FunctionComponent<FriendRequestListProps> = (props: FriendRequestListProps) => {
    const {type: requestType} = props;
    const classes = useStyles();
    const dispatch = useDispatch();
    const {id: userId, name: userName, email: userEmail} = useTypedSelector(state => state.profile);
    const {friendRequests} = useTypedSelector(state => state.invitations)

    const sentFilter = (invitation: Invitation): boolean => invitation.senderId == userId;
    const receivedFilter = (invitation: Invitation): boolean => invitation.recipientId == userId;
    const filter = requestType == "sent" ? sentFilter : receivedFilter;

    let receivedRequests = friendRequests.filter(filter);
    const handleAcceptFriendRequest = (invitation: Invitation) => {
        dispatch(updateInvitation(invitation, "Accepted"));
    }


    function handleCancelOrDeleteFriendRequest(invitation: Invitation) {
        dispatch(updateInvitation(invitation, requestType == "sent" ? "Cancelled" : "Declined"));
    }

    return receivedRequests.length > 0 ? <Card
        className={classes.root}><CardContent><Typography>{requestType == "sent" ? "Sent" : "Received"} Invitations</Typography>
        <Divider/>
        <List>
            {receivedRequests.map(invitation => <ListItem key={invitation.id}>
                <ListItemText primary={`${requestType == "sent" ? invitation.recipientName :invitation.senderName} - ${invitation.status}`} secondary={formatDistanceToNow(new Date(invitation.created))}/>
                <ListItemSecondaryAction>
                    {requestType == "received" ? <IconButton
                        onClick={() => handleAcceptFriendRequest(invitation)}><CheckCircleOutlineIcon/></IconButton> : ""}
                    <IconButton onClick={()=>handleCancelOrDeleteFriendRequest(invitation)}><CancelIcon/></IconButton></ListItemSecondaryAction>
            </ListItem>)}
        </List></CardContent></Card> : <div/>
};

const useStyles = makeStyles({
    root: {

    }
});

export default FriendRequestList;
