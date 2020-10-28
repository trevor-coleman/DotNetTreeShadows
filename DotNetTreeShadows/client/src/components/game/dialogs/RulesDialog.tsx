import React, { FunctionComponent, useState } from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Dialog, DialogContent } from '@material-ui/core';
import { Rules } from '../../Rules';
import Grid from '@material-ui/core/Grid';
import useTheme from '@material-ui/core/styles/useTheme';
import Box from '@material-ui/core/Box';
import { showRulesDialog } from "../../../store/appState/reducer";
import { useTypedSelector } from '../../../store';

interface RulesDialogProps {
}

//COMPONENT
const RulesDialog: FunctionComponent<RulesDialogProps> = (props: RulesDialogProps) => {
  const {} = props;
  const theme = useTheme();
  const classes = useStyles();
  const dispatch = useDispatch();
  const open = useTypedSelector(state => state.appState.rulesDialog.open)

  const handleClose = ()=> {
                             dispatch(showRulesDialog(false));
                           }
  
  return (
      <Dialog open={open} onClose={handleClose} maxWidth={"lg"}>
        <DialogContent>
          <Grid container justify={"center"}>
            <Grid item>
              <Rules />
            </Grid>
          </Grid>
      </DialogContent>
      </Dialog>);
};

const useStyles = makeStyles((theme: Theme) => (
    {
      root: {},
      rules: {
        marginLeft: theme.spacing(3),
        marginRight: theme.spacing(3),
      },
    }))

export default RulesDialog;
