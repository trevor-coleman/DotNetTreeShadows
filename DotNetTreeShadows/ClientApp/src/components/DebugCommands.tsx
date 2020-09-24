import React, { useState } from 'react';
import {
  Button,
  Form,
  FormGroup,
  Input,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  Card,
  CardTitle,
  CardBody,
  CardText,
  ButtonDropdown,
  DropdownToggle,
  Row,
} from 'reactstrap';
import axios, { AxiosResponse } from 'axios';
import AccountButtons from './DebugControls/AccountButtons';
import FriendInvitations from './DebugControls/FriendInvitations';
import TurnActions from './DebugControls/TurnActions';
import SessionInvitation from './DebugControls/SessionInvitation';


const ACCOUNTS: Array<TreeShadowsAccount> = [
  {
    email: 'trevor@domain.com',
    password: 'TrevorPassword',
    userName: 'Trevor',
  },
  {
    email: 'billy@otherdomain.com',
    password: 'BillyPassword',
    userName: 'Billy',
  }, {
    email: 'sam@thirddomain.com',
    password: 'SamPassword',
    userName: 'Samantha',
  },
];

export type TreeShadowsAccount = {
  email: string;
  password: string;
  userName: string;
}

const DebugCommands = () =>
{

  const [tokens, setTokens] = useState<{ [email: string]: string }>({});
  const [profiles, setProfiles] = useState<{ [email: string]: any }>({});
  const [axiosOptionByEmail, setAxiosOptionsByEmail] = useState<{ [email: string]: any }>({});
  const [axiosOptionsById, setAxiosOptionsById] = useState<{ [email: string]: any }>({});
  const [friends, setFriends] = useState<Array<{name:string,id:string}>>()

  const updateTokens = (email: string, token: string) =>
  {
    console.log(token);

    let newTokens = {...tokens};
    newTokens[email] = token;
    setTokens(newTokens);

    const newAxiosOptions = {...axiosOptionByEmail};
    let options = {
      baseURL: 'https://localhost:5001/api/',
      timeout: 1000,
      headers: {Authorization: `Bearer ${token}`},
    };
    newAxiosOptions[email] = options;
    setAxiosOptionsByEmail(newAxiosOptions);

    let api = axios.create(options);

    if (token)
    {
      api.get('profiles/me', {headers: {Authorization: `Bearer ${token}`}}).then((r: any) =>
      {
        updateProfiles(email, r.data);

        const newAxiosOptions = {...axiosOptionsById};
        let options = {
          baseURL: 'https://localhost:5001/api/',
          timeout: 1000,
          headers: {Authorization: `Bearer ${token}`},
        };
        newAxiosOptions[r.data.Id] = options;
        setAxiosOptionsById(newAxiosOptions);
        console.log(r.data);
      });
    }
  };

  const updateProfiles = (email: string, profile: any) =>
  {
    let newProfiles = {...profiles};
    newProfiles[email] = profile;
    setProfiles(newProfiles);
  };


  function sendInvitation(sender: any, recipient: string, sessionId: string|null, invitationType: 'friendRequest' | 'sessionInvite'): void
  {

    const options = axiosOptionByEmail[sender.email];
    const api = axios.create(options);

    console.log(recipient, sessionId,invitationType);
    
    
    
    switch (invitationType)
    {
      case 'friendRequest':
        api.post('profiles/me/friends', {Email: recipient}).then(r => console.log(r))
           .catch(r => console.log(r.statusText));
        break;
      case 'sessionInvite':
        api.post(`sessions/${sessionId}/players`, {id:recipient}).then(r=>console.log(r));
        break;
    }
    
  }

  async function getSession(asUserEmail: string, id: string)
  {
    const options = axiosOptionByEmail[asUserEmail];
    const api =  axios.create(options);
    
    const r = await api.get(`sessions/${id}`);
    return r.data;
    
  }


  function getFriends(profile:any)
  {
    const options = axiosOptionByEmail[profile.email];
    const api =  axios.create(options);
    
    Promise.all<AxiosResponse>(profile.friends.map((friend:string) => api.get(`profiles/${friend}`))).then(r=>setFriends(r.map(({data}:any)=>data)));
    
  }

  return (
      <div>
        <Row>
          {ACCOUNTS.map(account => <AccountButtons
              account={account}
              key={account.email}
              token={tokens[account.email]}
              updateTokens={updateTokens}/>)}
        </Row>

        <Row><FriendInvitations profiles={profiles} emails={ACCOUNTS.map(account => account.email)}
                           sendInvitation={sendInvitation}/>
              <SessionInvitation profiles={profiles} friends={friends} getFriends={getFriends} sendInvitation={sendInvitation}/>             
        </Row>
                     
                     <TurnActions profiles={profiles} getSession={getSession}></TurnActions>

      </div>
  );
};



interface InvitationsProps
{
  profiles: { [email: string]: any };
}


export default DebugCommands;