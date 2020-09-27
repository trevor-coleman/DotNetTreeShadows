import React, { FunctionComponent, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../store';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CardContent from '@material-ui/core/CardContent';
import Card from '@material-ui/core/Card';
import { sendFriendRequestAsync } from '../store/friends/thunks';
import Typography from '@material-ui/core/Typography';
import { resetFriendRequest } from '../store/friends/actions';

//REDUX MAPPING
const mapStateToProps = (state: RootState) => {
  return {
    resultMessage: state.friends.sendFriendRequestResultMessage,
    addingFriend: state.friends.sendingFriendRequest,
    succeeded: state.friends.sendFriendRequestSucceeded,
  };
};

const mapDispatchToProps = {
  sendFriendRequest: (email: string) => sendFriendRequestAsync(email),
  resetFriendRequest: resetFriendRequest()
};

//REDUX PROP TYPING
const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

interface IAddFriendFormProps {}

type AddFriendFormProps = IAddFriendFormProps & PropsFromRedux;

//COMPONENT
const AddFriendForm: FunctionComponent<AddFriendFormProps> = (props: AddFriendFormProps) => {
  const classes = useStyles();
  const {sendFriendRequest, resultMessage, succeeded, resetFriendRequest} = props;
  const [email, setEmail] = useState('');

  return <Card className={classes.AddFriendForm}>
    <CardContent>
      {succeeded
       ? <><Typography variant="h6">Success</Typography>
          <div><Button
            variant="outlined"
            color="primary"
            onClick={()=> {resetFriendRequest();setEmail("")} }>
            Add Another Friend
          </Button></div>
       </>
       : <form
         noValidate
         autoComplete="off">
         <div><TextField
           required
           id="email"
           label="email"
           type="email"
           autoComplete="email"
           className={classes.TextInput}
           value={email}
           onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} /></div>
         <div><Button
           variant="outlined"
           disabled={email.length < 3}
           color="primary"
           onClick={() => sendFriendRequest(email)}>Add Friend</Button></div>
       </form>}
      {resultMessage
       ? resultMessage
       : ""}
    </CardContent>
  </Card>;
};

const useStyles = makeStyles({
  AddFriendForm: {},
  TextInput: {
    width: "100%",
    margin: 5,
  },
});

export default connector(AddFriendForm);
;
