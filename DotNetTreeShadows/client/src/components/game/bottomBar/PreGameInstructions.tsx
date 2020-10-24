import React, {FunctionComponent} from 'react';
import {useDispatch} from 'react-redux';
import {makeStyles, Theme} from '@material-ui/core/styles';
import { Typography, Grid } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import {useIsHost} from "../../../store/profile/reducer";


interface PreGameInstructionsProps {
}

//COMPONENT
const PreGameInstructions: FunctionComponent<PreGameInstructionsProps> = (props: PreGameInstructionsProps) => {
  const {} = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const isHost = useIsHost();

  return (
    <Box className={classes.root} display={"flex"} alignItems={"center"} justifyContent={"center"}>
      <div>
          <Typography paragraph variant={'h6'} className={classes.title}>Waiting for the host to start the game.</Typography>
      </div>
    </Box>
  )
};

const useStyles = makeStyles((theme: Theme) => (
  {
    root: {height:"100%"},
    title: {
      marginBottom: theme.spacing(1),
    }}))


export default PreGameInstructions;
