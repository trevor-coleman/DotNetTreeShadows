import React, {FunctionComponent, useState} from 'react';
import {useDispatch} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import {addFriend} from "../store/invitations/actions";


interface AddFriendCardProps {
}

//COMPONENT
const AddFriendCard: FunctionComponent<AddFriendCardProps> = (props: AddFriendCardProps) => {
    const {} = props;
    const classes = useStyles();
    const dispatch = useDispatch();

    const [addFriendEmail, setAddFriendEmail] = useState("");

    const handleAddFriend = ()=> {
        dispatch(addFriend(addFriendEmail))
        setAddFriendEmail("");
    }

    return (
        <Card variant="outlined" className={classes.addFriendCard} >
            <CardContent>
                <Typography>Send Friend Request</Typography>
                <form className={classes.addFriendForm} noValidate autoComplete="off">
                    <TextField id="standard-basic" label="Email" className={classes.friendEmail} value={addFriendEmail} onChange={e=>setAddFriendEmail(e.target.value)}/>
                    <Button color="primary" className={classes.addFriendButton} variant={"contained"} onClick={handleAddFriend}>Add Friend</Button>
                </form>
            </CardContent>
        </Card>);
};

const useStyles = makeStyles({
    root: {},
    addFriendCard: {
        marginTop:16,
        marginBottom:16,

    },
    addFriendForm: {
        width: "100%"
    },
    friendEmail: {
        width: "24em",
        marginBottom: 8
    }, addFriendButton: {
        alignSelf:'flex-end'
    }
});

export default AddFriendCard;
