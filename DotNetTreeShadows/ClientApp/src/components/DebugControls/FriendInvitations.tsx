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
  profiles: { [email: string]: any };
  emails: Array<string>;
  sendInvitation: any;
  // sendInvitation: (sender:any, reciever:any, invitationType : 'friendRequest' | 'sessionInvite' ) => Promise<string>;
}

const FriendInvitations = ({profiles, emails, sendInvitation}: IInvitationsProps) =>
{
  let profilesArray = Object.values(profiles);

  const [sendersOpen, setSendersOpen] = useState(false);
  const [sender, setSender] = useState<any>();
  const toggleSender = () => setSendersOpen(!sendersOpen);


  const [recipientOpen, setRecipientOpen] = useState(false);
  const [recipient, setRecipient] = useState<string>();
  const toggleRecipient = () => setRecipientOpen(!recipientOpen);
  
  const [invitationType, setInvitationType] = useState<'friendRequest' | 'sessionInvite' | ''>('');
  const [typeOpen, setTypeOpen] = useState(false);
  const [status, setStatus] = useState<string>();
  
  const [sessionId, setSessionId] = useState<string>();
  
  
  const toggleType = () => setTypeOpen(!typeOpen);
  
  
  
  return <Card>
    <CardBody><CardTitle>Friend Invitations</CardTitle>
      <CardText><b>{sender ?
                    sender.name : 'Select a name'}</b></CardText>
    From: <ButtonDropdown isOpen={sendersOpen} toggle={toggleSender}>
      <DropdownToggle disabled={profilesArray.length == 0} caret={profilesArray.length > 0 }>{profilesArray.length == 0 ? 'No senders' : sender
                                                                                                             ? sender.name
                                                                                                             : 'Select Sender'}</DropdownToggle>
      <DropdownMenu>
        {profilesArray.map(profile =>
        {
          return <DropdownItem key={profile.id} onClick={() => setSender(profile)}>{profile.name}</DropdownItem>;
        })}
      </DropdownMenu>
    </ButtonDropdown>

      
    {sender ? <div>
      To: <ButtonDropdown isOpen={recipientOpen} toggle={toggleRecipient}>
      <DropdownToggle disabled={profilesArray.length == 0} caret={profilesArray.length > 0 }>{profilesArray.length == 0 ? 'No recipients' : recipient
                                                                                                                                         ? recipient : 'Select Recipient'}
      </DropdownToggle>
      <DropdownMenu>
        {emails.map(email => <DropdownItem key={email} onClick={() => setRecipient(email)}>{email}</DropdownItem>)}
      </DropdownMenu>
    </ButtonDropdown>
    </div> : " "}
    
    {recipient ? <Button color={"primary"} onClick={async ()=>
    {
      setStatus(await sendInvitation(sender, recipient, sessionId, 'friendRequest'));
      setRecipient('');
      setInvitationType('');
      setRecipient('');
    }}>Send Invitation</Button> : ''}
    
    {status ? status : ""}

    </CardBody></Card>;
};

export default FriendInvitations;