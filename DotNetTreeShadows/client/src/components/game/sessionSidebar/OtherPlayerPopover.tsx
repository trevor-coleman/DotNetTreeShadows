import React, { FunctionComponent, PropsWithChildren } from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import { Box } from '@material-ui/core';
import { useTypedSelector } from '../../../store';
import { showOtherPlayerPopover } from "../../../store/appState/reducer";
import PlayerBoardDisplay from '../playerSidebar/PlayerBoardDisplay';
import AvailablePieces from '../playerSidebar/AvailablePieces';

interface OtherPlayerPopoverProps {
  anchorEl: HTMLElement | null;
  id: string | null;
}

//COMPONENT
const OtherPlayerPopover: FunctionComponent<OtherPlayerPopoverProps> = (props: OtherPlayerPopoverProps) => {
  const {anchorEl, id} = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const open = useTypedSelector(state => state.appState.otherPlayerPopover.open)



  return (
      <Popover
          open={open && Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={()=>dispatch(showOtherPlayerPopover(false))}
          anchorOrigin={{
            vertical:"center",
            horizontal: "right",

          }}
          transformOrigin={{
            vertical:"top",
            horizontal:"left"
          }}
      >
        <Box p={2}>
          <PlayerBoardDisplay id={id}/>
          <AvailablePieces id={id}/>
        </Box>
      </Popover>
      );
};

const useStyles = makeStyles((theme: Theme) => (
    {
      root: {},
    }));

export default OtherPlayerPopover;
