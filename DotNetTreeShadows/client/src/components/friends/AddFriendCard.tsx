import React, { FunctionComponent, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import { addFriend } from "../../store/invitations/thunks";
import {
  useFriendRequestState,
  resetFriendRequestState
} from "../../store/invitations/reducer";
import { RequestState } from "../../api/requestState";
import { IconButton } from "@material-ui/core";
import CancelIcon from "@material-ui/icons/Cancel";
import Fade from "@material-ui/core/Fade";

interface AddFriendCardProps {}

//COMPONENT
const AddFriendCard: FunctionComponent<AddFriendCardProps> = (
  props: AddFriendCardProps
) => {
  const {} = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const { state, errorMessage } = useFriendRequestState();
  const [lastSent, setLastSent] = useState<string | null>(null);
  const error = state == RequestState.Rejected;

  const [friendInfo, setFriendInfo] = useState("");

  const handleAddFriend = () => {
    dispatch(addFriend(friendInfo));
    setLastSent(friendInfo);
  };

  if (state == RequestState.Fulfilled && lastSent == friendInfo) {
    setFriendInfo("");
    setLastSent(null);
  }

  useEffect(()=>{
    if(error && friendInfo !== lastSent) dispatch(resetFriendRequestState());
  })

  return (
    <Card variant="outlined" className={classes.addFriendCard}>
      <CardContent>
        <Typography>Send Friend Request</Typography>
        <form className={classes.addFriendForm} noValidate autoComplete="off">
          <TextField
            id="standard-basic"
            error={error}
            helperText={errorMessage}
            label="Email or Username"
            className={classes.friendEmail}
            value={friendInfo}
            onChange={e => setFriendInfo(e.target.value)}
            InputProps={{
              endAdornment: (
                <Fade in={friendInfo.length > 0}>
                  <IconButton
                    size={"small"}
                    onClick={() => {
                      setFriendInfo("");
                    }}
                  >
                    <CancelIcon />
                  </IconButton>
                </Fade>
              )
            }}
          />
          <Button
            color="primary"
            className={classes.addFriendButton}
            variant={"contained"}
            onClick={handleAddFriend}
          >
            Add Friend
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

const useStyles = makeStyles({
  root: {},
  addFriendCard: {
    marginTop: 16,
    marginBottom: 16
  },
  addFriendForm: {
    width: "100%"
  },
  friendEmail: {
    width: "24em",
    marginBottom: 8
  },
  addFriendButton: {
    alignSelf: "flex-end"
  }
});

export default AddFriendCard;
