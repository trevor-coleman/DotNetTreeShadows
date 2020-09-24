import {
  ButtonDropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Row,
} from 'reactstrap';
import React, { useState } from 'react';

interface ISessionPickerProps {
  sessions: Array<any>;
  selected: string | undefined;
  onSelect: (session:any)=>void;
}

const SessionPicker = ({sessions, selected, onSelect}: ISessionPickerProps) =>
{

  const [sessionsOpen, setSessionsOpen] = useState(false);
  const toggleSessions = () => setSessionsOpen(!sessionsOpen);
  
  return <ButtonDropdown isOpen={sessionsOpen} toggle={toggleSessions}>
    <DropdownToggle disabled={sessions.length == 0} caret={sessions.length > 0}>{sessions.length == 0 ? 'No sessions'
                                                                                                      : selected
                                                                                                        ? selected
                                                                                                        : 'Select Session'}</DropdownToggle>
    <DropdownMenu>
      {sessions.map(session =>
      {
        return <DropdownItem key={session} onClick={() =>
        {
          onSelect(session);
        }}>{session}</DropdownItem>;
      })}
    </DropdownMenu>
  </ButtonDropdown>;
}

export default SessionPicker;