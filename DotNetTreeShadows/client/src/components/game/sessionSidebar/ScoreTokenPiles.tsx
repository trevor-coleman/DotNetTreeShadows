import React, { FunctionComponent, useState } from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import { Typography } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { useScoringTokenPiles } from '../../../store/game/reducer';
import Avatar from '@material-ui/core/Avatar';
import { tileColor } from '../../helpers/treeColor';

interface ScoreTokenPilesProps {
}

//COMPONENT
const ScoreTokenPiles: FunctionComponent<ScoreTokenPilesProps> = (props: ScoreTokenPilesProps) => {
  const {} = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const scoringTokens = useScoringTokenPiles();
  const [mouseOver, setMouseOver] = useState<number|null>();

  const tokenDisplay = ()=> {

    const result: { leaves: number, topValue: number, remaining: number }[] = [];

    for(let s in scoringTokens) {
      const tokens = scoringTokens[s];
      result.push({leaves: parseInt(s), topValue: tokens[0], remaining: tokens.length})
    }
    return result
  }


  return (
    <Paper>
      <Box p={2}>
        <Typography variant={"subtitle1"}>Scoring Tokens</Typography>
        <Divider className={classes.divider} />
        <Grid container spacing={2} direction={"row"}>
          {tokenDisplay().map((pile, index) => (
            <Grid item key={`${pile.leaves}-${pile.topValue}-${index}`}>
              <Avatar
                onMouseEnter={() => {
                  if(pile.topValue) setMouseOver(pile.leaves);
                }}
                onMouseLeave={() => {
                  if (mouseOver == pile.leaves) setMouseOver(null);
                }}
                style={{ backgroundColor: pile.topValue ? tileColor(4 - pile.leaves) : "lightgrey" }}
              >
                {mouseOver == pile.leaves ? pile.remaining : (pile.topValue ?? "-") }
              </Avatar>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Paper>
  );
};

const useStyles = makeStyles((theme: Theme) => (
    {
      root: {},
      divider: {
        marginBottom: theme.spacing(1)
      }
    }));

export default ScoreTokenPiles;
