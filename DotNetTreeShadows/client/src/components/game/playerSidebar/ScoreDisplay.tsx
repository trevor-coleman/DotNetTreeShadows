import React, { FunctionComponent, useState } from "react";
import { useDispatch } from "react-redux";
import { makeStyles, Theme } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import { Typography, Avatar } from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import Paper from "@material-ui/core/Paper";
import { useCollectedScoreTokens } from '../../../store/game/reducer';
import Grid from '@material-ui/core/Grid';
import Color from 'color';
import interpolate from 'color-interpolate';
import { tileColor } from '../../helpers/treeColor';

interface ScoreDisplayProps {}

//COMPONENT
const ScoreDisplay: FunctionComponent<ScoreDisplayProps> = (
  props: ScoreDisplayProps
) => {
  const {} = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const scoreTokens = useCollectedScoreTokens();




  interface TokenProps {
    token: { leaves: number, points: number }
  }
  const ScoringTokenAvatar = ( { token }:TokenProps)=>{

    const [open, setOpen] = useState(false);

    return <Avatar onMouseEnter={()=>setOpen(true)} onMouseLeave={()=>setOpen(false)} style={{backgroundColor: tileColor(4-token.leaves), color:"#fff", cursor:"default" } }>{open ? `${token.points}`: " "}</Avatar>
  };
  
  return (
    <Paper>
      <Box p={2}>
        <Typography variant={"subtitle1"}>Collected Tokens</Typography>
        <Divider className={classes.divider} />
        <Grid container spacing={2} direction={"row"}>
          {scoreTokens.slice().sort((a,b)=>b.leaves - a.leaves ).map((token, index) => (
            <Grid item key={`${token.leaves}-${token.points}-${index}`}>
              <ScoringTokenAvatar token={token}/>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Paper>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  divider: {
    marginBottom: theme.spacing(1)
  }
}));

export default ScoreDisplay;
