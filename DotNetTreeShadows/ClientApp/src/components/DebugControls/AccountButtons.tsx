import React, { useState } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardText,
  CardTitle,
} from 'reactstrap';
import axios from 'axios';
import { TreeShadowsAccount } from '../DebugCommands';


type AccountButtonsProps = {
  account: TreeShadowsAccount,
  token: string,
  updateTokens: (email: string, token: string, axiosOptions: any) => void
}

const AccountButtons = ({account, updateTokens, token}: AccountButtonsProps) =>
{


  const bodyParameters = {
    key: 'value',
  };

  let [profile, setProfile] = useState<any>();
  let [status, setStatus] = useState<string>();

  let loggedIn = !!token;

  const axiosOptions = {
    baseURL: 'https://localhost:5001/api/',
    timeout: 1000,
    headers: {Authorization: `Bearer ${token}`},
  }
  
  const api = axios.create(axiosOptions);


  const SignIn = () => api.post('authenticate/login', {...account, userName: undefined})
                          .then(r =>
                          {
                            setStatus("SignIn: " + r.statusText);
                            updateTokens(account.email, r.data.token, axiosOptions);
                          }).catch(r=>setStatus("Failed: " + r.statusText));
  
  const SignOut = () => {updateTokens(account.email, '', {});}
  const Register = () => api.post('authenticate/register', account).then(r => console.log(r)).catch(r=>
  {
    console.log(r.response.data.message);
    setStatus('Failed: ' + r.response.data.message);
  });
  const GetProfile = () => api.get('profiles/me').then(r=>
  {
    setStatus("GetProfile:" + r.statusText);
    setProfile(r.data);
  }).catch(r=>setStatus("Failed: " + r.response.statusText));
  
  const GetInvitations = (invitations:Array<string>)=> {
    invitations.map(async id => {
      const result = await api.get(`invitations/${id}`);
      return result.data;
    })
  }

  const NewSession = () => api.get('sessions/new').then(r=>setStatus(`new Session: ${r.statusText}`)).catch(r=>setStatus(r.statusText)) 
  
  const UpdateInvitation = (id:string, status: string) => {
    api.post(`invitations/${id}/status`, {invitationStatus: status} ).then(r=>GetProfile())
  }

  const ReceivedInvitationButtons = (id:string)=> (<div key={id}>
    <Button onClick={()=>UpdateInvitation(id, 'Accepted')}>Accept</Button>{' '}
    <Button onClick={()=>UpdateInvitation(id, 'Declined')}>Decline</Button> </div>)


  const SentInvitationButtons = (id:string)=> (<div key={id}>
    <Button>Cancel</Button>{' '}
  </div>)

  return (<Card style={{width:'33%'}} >
        <CardBody><CardTitle><h3>{account.userName}</h3></CardTitle>
          {loggedIn ? <Button size='med' style={{margin:5}} color='danger' onClick={SignOut}>Sign
            Out</Button> :<Button size='med' style={{margin:5}} color={loggedIn ? 'primary' : 'success'} onClick={SignIn} disabled={loggedIn}>Sign
            In</Button>}{' '}<Button size='med' style={{margin:5}} onClick={Register}>Register</Button>{' '}<Button size='med' style={{margin:5}} onClick={GetProfile}>GetProfile</Button>
          {' '}<Button size='med' color={'success'} style={{margin:5}} onClick={NewSession}>New Session</Button>
          <CardText>{status ? status : '  '}</CardText>
          {profile && profile.receivedInvitations ? profile.receivedInvitations.map((id:string)=>ReceivedInvitationButtons(id)):''}
          {profile && profile.sentInvitations ? profile.sentInvitations.map((id:string)=>SentInvitationButtons(id)):''}
          
        </CardBody>

      </Card>
  );
};





export default AccountButtons;

