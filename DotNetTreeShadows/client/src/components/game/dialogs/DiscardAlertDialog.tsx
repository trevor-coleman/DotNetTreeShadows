import React, { FunctionComponent } from "react";
import { useDispatch } from "react-redux";
import { makeStyles, Theme } from "@material-ui/core/styles";
import DialogTitle from "@material-ui/core/DialogTitle";
import { DialogContent, DialogActions, Button } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import { useDiscardAlertDialog, showDiscardAlertDialog } from "../../../store/appState/reducer";
import DialogContentText from "@material-ui/core/DialogContentText";
import { pieceTypeName } from "../../../store/board/types/pieceType";
import { clearCurrentAction } from "../../../store/game/reducer";
import { useOrigin } from '../../../store/board/reducer';
import gameActions from '../../../gamehub/gameActions';

interface DiscardAlertDialogProps {}

//COMPONENT
const DiscardAlertDialog: FunctionComponent<DiscardAlertDialogProps> = (
  props: DiscardAlertDialogProps
) => {
  const {} = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const { open, pieceType } = useDiscardAlertDialog();
  const origin = useOrigin();


  const handleCancel=()=>{
  dispatch(showDiscardAlertDialog({open: false, pieceType: null}))
  dispatch(clearCurrentAction())
  }

  const handleContinue=async () => {
    if(origin !== null) {
                          await gameActions.grow(origin);
            dispatch(showDiscardAlertDialog({
        open: false,
        pieceType: null
      }))
                          dispatch(clearCurrentAction());
                        }
    
  }

  return (
    <Dialog
      open={open}
      aria-labelledby="form-dialog-title"
      maxWidth="xs"
      fullWidth={true}
    >
      <DialogTitle id="form-dialog-title">
        Warning: {pieceType ? pieceTypeName(pieceType) : "Piece"} will be
        discarded
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          There is no open space on your player board to return your {pieceType
                                                                      ? pieceTypeName(
                pieceType)
                                                                      : "piece"}.
        </DialogContentText>
        <DialogContentText>
          If you
          complete this action, your {' '}
          {pieceType
           ? pieceTypeName(pieceType)
           : "piece"} will be permanently removed from
          the game.{" "}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={()=>handleCancel()}>Cancel</Button>
        <Button color={"secondary"} onClick={()=>handleContinue()}>Discard Piece</Button>
      </DialogActions>
    </Dialog>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  root: {}
}));

export default DiscardAlertDialog;
