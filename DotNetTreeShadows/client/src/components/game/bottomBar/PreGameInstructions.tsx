import React, {FunctionComponent} from 'react';
import {useDispatch} from 'react-redux';
import {makeStyles, Theme} from '@material-ui/core/styles';
import {Typography} from "@material-ui/core";
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
    <Box className={classes.root}>

      {isHost ?
        <>
          <Typography
            paragraph
            variant={'subtitle1'}
            className={classes.title}>
            Start the game when ready
          </Typography>
          <Button color={"secondary"} size={"large"} variant={"contained"}>Start the Game</Button>
        </>
        :
        <>
          <Typography paragraph variant={'subtitle1'} className={classes.title}>Start the game when ready</Typography>
          <Button color={"secondary"} size={"large"} variant={"contained"}>Start the Game</Button>
        </>
      }
    </Box>
  )
};

const useStyles = makeStyles((theme: Theme) => (
  {
    root: {},
    title: {
      marginBottom: theme.spacing(1),
    }
  }))


export default PreGameInstructions;
