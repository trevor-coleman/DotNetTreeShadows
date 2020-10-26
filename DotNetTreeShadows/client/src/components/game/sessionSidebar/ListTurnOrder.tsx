import React, { FunctionComponent, useState } from "react";
import { useDispatch } from "react-redux";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { useTypedSelector } from "../../../store";
import { List, Switch, ListSubheader } from "@material-ui/core";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import ListItemText from "@material-ui/core/ListItemText";
import PlayerBoard from "../../../store/game/types/playerBoard";
import TreeAvatarIcon from "../playerSidebar/TreeAvatarIcon";
import FriendAvatar from "../../friends/FriendAvatar";
import Divider from "@material-ui/core/Divider";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import IconButton from "@material-ui/core/IconButton";
import { showAddPlayerDialog } from "../../../store/appState/reducer";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import DeleteOutlineOutlinedIcon from "@material-ui/icons/DeleteOutlineOutlined";
import { GameStatus } from "../../../store/game/types/GameStatus";
import { updateInvitation } from "../../../store/invitations/thunks";
import Emoji from "a11y-react-emoji";
import CollapsingBox from "../../CollapsingBox";
import { sendLinkEnabled } from "../../../store/signalR/actions";
import { useLocation } from "react-router-dom";
import Collapse from '@material-ui/core/Collapse';

interface ListTurnOrderProps {}

//COMPONENT
const ListTurnOrder: FunctionComponent<ListTurnOrderProps> = (
  props: ListTurnOrderProps
) => {
  const {} = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const location = useLocation();
  const {
    playerBoards,
    turnOrder,
    currentTurn,
    status,
    firstPlayer
  } = useTypedSelector(state => state.game);
  const {
    players,
    host,
    invitedPlayers,
    connectedPlayers,
    id: sessionId,
    linkEnabled
  } = useTypedSelector(state => state.session);
  const { friends, id: playerId } = useTypedSelector(state => state.profile);
  const { sessionInvites } = useTypedSelector(state => state.invitations);
  const [copySuccess, setCopySuccess] = useState(false);

  async function copyToClipboard(
    e:
      | React.MouseEvent<HTMLLIElement>
      | React.MouseEvent<HTMLAnchorElement>
      | React.MouseEvent<HTMLDivElement>
  ) {
    setCopySuccess(false);
    await navigator.clipboard.writeText(
      `${window.location.href.replace("sessions", "join")} `
    );
    setCopySuccess(true);
  }

  const openAddPlayerDialog = () => {
    dispatch(showAddPlayerDialog(true));
  };

  console.log(location);

  async function cancelInvitation(recipientId: string) {
    const toCancel = sessionInvites.find(
      inv => inv.resourceId == sessionId && inv.recipientId == recipientId
    );
    if (toCancel) {
      await dispatch(updateInvitation(toCancel, "Cancelled"));
    } else {
      console.error(
        `Could not find invitation for recipient in session:
         Recipient: ${recipientId} 
         Session  : ${sessionId})
         SessionInvites:`,
        sessionInvites
      );
    }
  }

  const turns = () => {
    if (firstPlayer == null) return turnOrder;
    const result = [];

    const fp = turnOrder.indexOf(firstPlayer);

    for (let i = 0; i < turnOrder.length; i++) {
      const adjustedIndex = (i + fp) % turnOrder.length;

      result.push(turnOrder[adjustedIndex]);
    }

    return result;
  };

  const showInvitePlayers =
    turnOrder.length + invitedPlayers.length < 4 &&
    playerId == host &&
    status == GameStatus.Preparing;

  return (
    <CollapsingBox title={"Turn Order"}>
      <List dense>
        {turns().map((id: string) => {
          let isConnected = connectedPlayers
            ? connectedPlayers.indexOf(id) >= 0
            : false;
          return (
            <ListItem key={id} selected={turnOrder[currentTurn] == id}>
              <ListItemAvatar>
                <TreeAvatarIcon
                  fontSize={"large"}
                  active={false}
                  connected={isConnected}
                  treeType={PlayerBoard.TreeType(playerBoards[id])}
                />
              </ListItemAvatar>
              <ListItemText
                primary={`${
                  id == playerId ? "You" : players[id]?.name ?? "Player"
                }`}
                secondary={
                  firstPlayer == id ? (
                    <>
                      <Emoji symbol="☀️" label="firstPlayer" /> {"First Player"}{" "}
                    </>
                  ) : (
                    ""
                  )
                }
              />
            </ListItem>
          );
        })}
        {invitedPlayers ? (
          invitedPlayers.map(id => {
            return (
              <ListItem key={id} selected={turnOrder[currentTurn] == id}>
                <ListItemAvatar>
                  <FriendAvatar fontSize={"large"} id={id} />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    friends.find(f => f.id == id)?.name ?? "Invited Player"
                  }
                  secondary={"Invited"}
                />
                {playerId == host ? (
                  <ListItemSecondaryAction>
                    <IconButton onClick={() => cancelInvitation(id)}>
                      <DeleteOutlineOutlinedIcon color={"secondary"} />
                    </IconButton>
                  </ListItemSecondaryAction>
                ) : (
                  ""
                )}
              </ListItem>
            );
          })
        ) : (
          <div />
        )}
        {showInvitePlayers ? (
          <>
            <ListItem button onClick={openAddPlayerDialog}>
              <ListItemAvatar>
                <Avatar>
                  <PersonAddIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={"Invite Players"} />
            </ListItem>
            <Divider className={classes.linkDivider} />
            <ListSubheader>Invitation Link</ListSubheader>
            <ListItem>
              <ListItemAvatar>
                <Switch
                  checked={linkEnabled}
                  onChange={() => {
                    dispatch(sendLinkEnabled(sessionId, !linkEnabled));
                  }}
                  name="checkedA"
                />
              </ListItemAvatar>
              <ListItemText primary={"Enable"} />
            </ListItem>
            <Collapse in={linkEnabled}>
              <ListItem button onClick={copyToClipboard}>
                <ListItemText className={classes.link}
                              primary={`${window.location.href.replace(
                                  "sessions",
                                  "join")} `}
                              secondary={copySuccess
                                         ? "Copied!"
                                         : "Click to Copy"} />
              </ListItem>
            </Collapse>
          </>
        ) : (
          ""
        )}
      </List>
    </CollapsingBox>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  linkDivider: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
  },
  link: {
    maxWidth: 220,
    overflowWrap: "break-word",
    wordWrap: "break-word"
  }
}));

export default ListTurnOrder;
