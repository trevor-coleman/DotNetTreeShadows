import React, {FunctionComponent} from 'react';
import {useDispatch} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import {Button, DialogContent, DialogActions, ListItem} from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContentText from "@material-ui/core/DialogContentText";
import {useTypedSelector} from "../../../store";
import List from "@material-ui/core/List";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import ListItemText from "@material-ui/core/ListItemText";
import {showAddPlayerDialog, setAddPlayerDialogChecked} from '../../../store/appState/reducer'
import {inviteFriendsToSession} from "../../../store/appState/reducer";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Checkbox from "@material-ui/core/Checkbox";
import {RequestState} from "../../../api/requestState";
import CircularProgress from "@material-ui/core/CircularProgress";

interface AddPlayerDialogProps {
}

//COMPONENT
const AddPlayerDialog: FunctionComponent<AddPlayerDialogProps> = (props: AddPlayerDialogProps) => {
    const {} = props;
    const classes = useStyles();
    const dispatch = useDispatch();
    const {friends} = useTypedSelector(state => state.profile);
    const {id: sessionId, invitedPlayers} = useTypedSelector(state => state.session);
    const {open, requestState, message, checked} = useTypedSelector(state => state.appState.addPlayerDialog);
    const {turnOrder} = useTypedSelector(state => state.game);


    const setChecked = (ids: string[]): void => {
        dispatch(setAddPlayerDialogChecked(ids))
    }

    const handleClose = () => {
        dispatch(showAddPlayerDialog(false))
    };

    async function inviteFriends() {
        console.log("inviting to session:", sessionId, checked);
        await dispatch(inviteFriendsToSession(checked, sessionId));
        setChecked([]);
    }


    const eligibleFriends = friends.filter(friend => {
        if (!invitedPlayers || invitedPlayers.indexOf(friend.id) == -1) return true;
        return false;
    })

    const handleToggle = (value: string) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    let openSpots = 4 - ((turnOrder?.length ?? 0) + (checked?.length ?? 0) + (invitedPlayers?.length ?? 0));
    let canAddMorePlayers = openSpots > 0 && eligibleFriends.length > 0;


    let dialogMessage = () => {
        switch (requestState) {
            case RequestState.Pending:
                return "Sending invitations";
            case RequestState.Rejected:
                return `Sending invitations failed! ${message}`
            case RequestState.Idle:
            case RequestState.Fulfilled:
                if(openSpots > 0) {
                    if(eligibleFriends.length == 0) return "No friends to add.";
                    return `${openSpots} spots remaining`
                }
                return "No more spots available."
        };

    }
    return (
        <div>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Select Friends to Add</DialogTitle>
                <DialogContent>
                    <DialogContentText>{dialogMessage()}</DialogContentText>
                    {requestState == RequestState.Pending ? <div className={classes.spinner}><CircularProgress/></div> :
                        <List>
                            {eligibleFriends.map(({id, name}, index) => {
                                const labelId = `checkbox-${id}`;
                                return <ListItem key={id}>
                                    <ListItemAvatar>
                                        <Avatar alt={`${name}`}>{name.charAt(0)}</Avatar>
                                    </ListItemAvatar>
                                    <ListItemText id={labelId}>
                                        {name}
                                    </ListItemText>
                                    <ListItemSecondaryAction>
                                        <Checkbox
                                            disabled={openSpots <= 0 && checked.indexOf(id) == -1}
                                            edge="end"
                                            onChange={handleToggle(id)}
                                            checked={checked.indexOf(id) !== -1}
                                            inputProps={{'aria-labelledby': labelId}}
                                        />
                                    </ListItemSecondaryAction>
                                </ListItem>
                            })}
                        </List>}</DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    {canAddMorePlayers || checked.length != 0 ? <Button onClick={inviteFriends} color="primary">
                        Invite
                    </Button> : <div/>}
                </DialogActions>
            </Dialog>
        </div>
    );


};

const useStyles = makeStyles({
    root: {},
    spinner: {
        display: 'flex',
        alignItems: "center",
        justifyContent: "center"
    }
});

export default AddPlayerDialog;
