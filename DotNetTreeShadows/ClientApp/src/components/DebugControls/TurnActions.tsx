import React, { useState } from 'react';
import {
  Button,
  ButtonDropdown,
  Card,
  CardBody,
  CardTitle,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  FormGroup,
  Input,
  Label,
  Row,
} from 'reactstrap';
import SessionPicker from './SessionPicker';


interface ITurnActionsProps
{
  profiles: { [email: string]: any };
  getSession: (asUserEmail:string, sessionId: string)=>any;
}


const TurnActions = ({profiles, getSession}:ITurnActionsProps) =>
{

  let profilesArray = Object.values(profiles);

  const [sendersOpen, setSendersOpen] = useState(false);
  const [sender, setSender] = useState<any>();
  const toggleSenders = () => setSendersOpen(!sendersOpen);
  
  const [sessionId, setSessionId] = useState<any>();
  
  const [pieceType, setPieceType] = useState<string|null>(null)
  const pieceTypes = ['Seed','SmallTree','MediumTree','LargeTree']
  
  const sessions: Array<string> = sender ? sender.sessions : [];
  
  const session:any|null = sessionId ? getSession(sender.email, sessionId): null;

  return (
      <Card>
        <CardBody>
          <CardTitle>Turn Actions</CardTitle>
          <Row style={{margin:20}}>
          <ButtonDropdown isOpen={sendersOpen} toggle={toggleSenders}>
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
          <SessionPicker sessions={sessions} selected={sessionId} onSelect={setSessionId}/>
          </Row>
          {sessionId ? <div><Row style={{margin:20}}>
            <Button style={{margin:5}} disabled={sessionId && pieceType ? false : true} color={'primary'} size={"med"}>Buy</Button>{' '}
            <Button style={{margin:5}} disabled={sessionId ? false : true} color={'primary'} size={"med"}>Plant</Button>{' '}
            <Button style={{margin:5}} disabled={sessionId ? false : true} color={'primary'} size={"med"}>Grow</Button>{' '}
            <Button style={{margin:5}} disabled={sessionId ? false : true} color={'primary'} size={"med"}>Collect</Button>
          </Row>
          <Row><div>
          <FormGroup tag="fieldset">
            {pieceTypes.map(pieceType =><FormGroup  key={pieceType} check>
              <Label check>
                <Input type="radio" name="pieceType" onClick={()=>setPieceType(pieceType)} />{' '}
                {pieceType}
              </Label>
            </FormGroup>)}
          </FormGroup></div></Row>
          </div>: ""}
        </CardBody>
      </Card>
  );
};

export default TurnActions;
