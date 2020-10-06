import React, { FunctionComponent } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../store';
import { List, IconButton, ListItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {
  updateInvitationStatusAsync, cancelInvitationAsync, acceptInvitationAsync, declineInvitationAsync,
} from '../store/z_old-invitations/thunks';
import Card from '@material-ui/core/Card';
import { Cancel, CheckCircleOutline, NotInterested, PersonAdd, GroupAdd } from '@material-ui/icons';
import Typography from '@material-ui/core/Typography';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import {Invitation} from "../types/invitation/invitation";

//REDUX MAPPING
const mapStateToProps = (state: RootState) => {
  return {
    sentInvitations: state.invitations.sentInvitations,
    receivedInvitations: state.invitations.receivedInvitations,
  };
};

const mapDispatchToProps = {
  cancelInvitation: cancelInvitationAsync,
  acceptInvitation: acceptInvitationAsync,
  declineInvitation: declineInvitationAsync,
};

//REDUX PROP TYPING
type PropsFromRedux = ConnectedProps<typeof connector>;

interface IInvitationListProps {}

type InvitationListProps = IInvitationListProps & PropsFromRedux;

//COMPONENT
const InvitationList: FunctionComponent<InvitationListProps> = (props: InvitationListProps) => {
  const classes = useStyles();
  const {sentInvitations, receivedInvitations, cancelInvitation, acceptInvitation, declineInvitation} = props;

  console.log("props", props);

  const cancelInvite = (invitation:Invitation)=>{
    cancelInvitation(invitation);
  }
  const acceptInvite = (invitation:Invitation)=>{
   console.log(acceptInvitation, invitation)
    acceptInvitation(invitation);
  }
  const declineInvite = (invitation:Invitation)=>{
    declineInvitation(invitation);
  }


  return <Card className={classes.InvitationList}>
    <CardContent>
      <Typography variant={'h5'}>Received</Typography>
      <List>
        {receivedInvitations.length > 0
         ? receivedInvitations.map(invitation=><ReceivedInvitationRow accept={acceptInvite} decline={declineInvite} key={invitation.id} invitation={invitation} />)
         : "None"}
      </List>
      <Divider/>
    <Typography variant={'h5'}>Sent</Typography>
    <List>
      {sentInvitations.length > 0
       ? sentInvitations.map(invitation=><SentInvitationRow key={invitation.id} cancel={cancelInvite} invitation={invitation} />)
      : "None"}
    </List>
  </CardContent>
  </Card>;
};

interface ReceivedInvitationRowProps {
  invitation: Invitation;
  accept: (invitation:Invitation)=>any;
  decline: (invitation:Invitation)=>any;
}

interface SentInvitationRowProps {
  invitation: Invitation;
  cancel: (invitation:Invitation)=>any;
}


const SentInvitationRow = ({invitation, cancel}:SentInvitationRowProps) => {
      return <ListItem>
        <ListItemIcon>
          {invitation.invitationType == 'FriendRequest'
           ? <PersonAdd />
           : ''}
          {invitation.invitationType == 'SessionInvite'
           ? <GroupAdd />
           : ''}
        </ListItemIcon>
        <ListItemText>{invitation.recipientName}</ListItemText>
        <ListItemSecondaryAction><IconButton
          edge="end"
        size='medium'
          onClick={()=>cancel(invitation)}
        >
          <Cancel/>
        </IconButton></ListItemSecondaryAction>
      </ListItem>
};
const ReceivedInvitationRow = ({invitation, accept, decline}:ReceivedInvitationRowProps) => {

  const classes = useStyles();

  return (
    <ListItem className={classes.InvitationRow}>
      <ListItemIcon>
        {invitation.invitationType == 'FriendRequest'
         ? <PersonAdd />
         : ''}
        {invitation.invitationType == 'SessionInvite'
         ? <GroupAdd />
         : ''}
      </ListItemIcon>
      <ListItemText>{invitation.senderName}</ListItemText>
      <ListItemSecondaryAction><IconButton
        edge="end"
        size='medium'
        onClick={() => {accept(invitation);}}
      >
        <CheckCircleOutline />
      </IconButton>
        <IconButton
          edge="end"
          size='medium'
          onClick={() => decline(invitation)}
        >
          <NotInterested />
        </IconButton></ListItemSecondaryAction>
    </ListItem>)
}

const useStyles = makeStyles({
  InvitationList: {width: 500},
  InvitationRow: {width: '100%'},
  AcceptButton: {

  },
  DeclineButton: {

  },
  CancelButton: {},
  Bold: {fontWeight: 700},
  Table: {width: 300},
});

const connector = connect(mapStateToProps, mapDispatchToProps);
export default connector(InvitationList);
