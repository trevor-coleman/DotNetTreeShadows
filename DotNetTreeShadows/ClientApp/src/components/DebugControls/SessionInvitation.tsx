import React, { useState } from 'react';
import {
  Button,
  ButtonDropdown,
  Card,
  CardBody,
  CardText,
  CardTitle,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from 'reactstrap';
import SessionPicker from './SessionPicker';


interface IInvitationsProps
{
  friends: Array<{name:string, id:string}> | undefined
  profiles: { [email: string]: any };
  getFriends: (profile:any) => void;
  sendInvitation: any;
}

const SessionInvitation = ({profiles, friends,  getFriends, sendInvitation}: IInvitationsProps) =>
{
  let profilesArray = Object.values(profiles);
  const [sendersOpen, setSendersOpen] = useState(false);
  const [sender, setSender] = useState<any>();
  const toggleSender = () => setSendersOpen(!sendersOpen);

  const [recipientOpen, setRecipientOpen] = useState(false);
  const [recipient, setRecipient] = useState<string>();
  const toggleRecipient = () => setRecipientOpen(!recipientOpen);
  
  const [sessionId, setSessionId] = useState<string>();
  
  const [status, setStatus] = useState('');

  return <Card>
    <CardBody><CardTitle>Session Invitations</CardTitle>
      <CardText><b>{sender ?
                    sender.name : 'Select a name'}</b></CardText>
      From: <ButtonDropdown isOpen={sendersOpen} toggle={toggleSender}>
        <DropdownToggle disabled={profilesArray.length == 0} caret={profilesArray.length > 0 }>{profilesArray.length == 0 ? 'No senders' : sender
                                                                                                                                           ? sender.name: 'Select Sender'}</DropdownToggle>
        <DropdownMenu>
          {profilesArray.map(profile =>
          {
            return <DropdownItem key={profile.id} onClick={async () =>
            {
              setSender(profile);
              getFriends(profile);
            }}>{profile.name}</DropdownItem>;
          })}
        </DropdownMenu>
      </ButtonDropdown>
      
      {sender ? <SessionPicker sessions={sender.sessions} selected={sessionId} onSelect={setSessionId} /> :""}
      
      {sessionId ? <div>
        To: <ButtonDropdown isOpen={recipientOpen} toggle={toggleRecipient}>
        <DropdownToggle disabled={friends ? friends.length == 0 : false} caret={friends && friends.length > 0 }>{friends && friends.length == 0 ? 'No recipients' : recipient
                                                                                                                                              ? recipient : 'Select Recipient'}
        </DropdownToggle>
        <DropdownMenu>
          {friends ? friends.map(friend => <DropdownItem key={friend.id} onClick={() => setRecipient(friend.id)}>{friend.name}</DropdownItem>) : ""}
        </DropdownMenu>
      </ButtonDropdown>
      </div> : " "}

      {recipient ? <Button color={"primary"} onClick={async ()=>
      {
        const invitationType:string ='sessionInvite';
        await sendInvitation(sender, recipient, sessionId, invitationType);
        setRecipient('');
        setSessionId('');
      }}>Send Invitation</Button> : ''}

      {status ? status : ""}

    </CardBody></Card>;
};

export default SessionInvitation;