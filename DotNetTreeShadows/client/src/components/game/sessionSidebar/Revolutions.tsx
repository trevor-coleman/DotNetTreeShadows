import React, {FunctionComponent} from 'react';
import {useDispatch} from 'react-redux';
import {makeStyles, Theme} from '@material-ui/core/styles';
import {Avatar, Grid, Paper} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import YearAvatarIcon from "./YearAvatarIcon";
import {useTypedSelector} from "../../../store";
import {GameOption} from "../../../store/game/types/GameOption";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";


interface YearsDisplayProps {
}

//COMPONENT
const Revolutions: FunctionComponent<YearsDisplayProps> = (props: YearsDisplayProps) => {
  const {} = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const {gameOptions, revolution} = useTypedSelector(state => state.game);

  const gameLength = gameOptions[GameOption.LongGame] == true ? 4 : 3;

  const YearIcon = ({sun}: { sun: boolean }) => {
    return (<Grid item><YearAvatarIcon sun={sun} size={40}/></Grid>)
  }

  const years = [];

  for (let i = 0; i < gameLength; i++) {
    years.push(i <= revolution);
  }

  return (
    <Paper>
      <Box p={2}>
        <Typography variant={'subtitle1'}>Revolutions</Typography>
        <Divider/>
        <Box p={2}>
          <Grid container spacing={1} direction={"row"} alignItems={"center"} justify={"center"}>
            {years.map((year, index) => <YearIcon key={index+"revolution"+new Date()} sun={year}/>)}
          </Grid>
        </Box>
      </Box>
    </Paper>

  )
};

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
}));

export default Revolutions;
