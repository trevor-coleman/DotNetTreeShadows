import React, { FunctionComponent, useState } from "react";
import { useDispatch } from "react-redux";
import { makeStyles, Theme } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import { Typography, SvgIcon } from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { useScoringTokenPiles } from "../../../store/game/reducer";
import Avatar from "@material-ui/core/Avatar";
import { tileColor } from "../../helpers/treeColor";
import EmptyOneLeaf from "../../../svg/exports/Empty-OneLeaf.svg";
import EmptyTwoLeaf from "../../../svg/exports/Empty-TwoLeaf.svg";
import EmptyThreeLeaf from "../../../svg/exports/Empty-ThreeLeaf.svg";
import EmptyFourLeaf from "../../../svg/exports/Empty-FourLeaf.svg";
import TreeAvatarIcon from "../playerSidebar/TreeAvatarIcon";
import Color from "color";
import { useTypedSelector } from '../../../store';
import CollapsingBox from '../../CollapsingBox';

interface ScoreTokenPilesProps {}

type ScoreTokenPile = { leaves: number; topValue: number; remaining: number };

//COMPONENT
const ScoreTokenPiles: FunctionComponent<ScoreTokenPilesProps> = (
  props: ScoreTokenPilesProps
) => {
  const {} = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const scoringTokens = useScoringTokenPiles();
  const turnOrder= useTypedSelector(state=>state.game.turnOrder)

  const tokenDisplay = () => {
    const result: ScoreTokenPile[] = [];

    for (let s in scoringTokens) {
      const tokens = scoringTokens[s];
      result.push({
        leaves: parseInt(s),
        topValue: tokens[tokens.length-1],
        remaining: tokens.length
      });
    }

    result.sort((a,b)=> b.leaves-a.leaves);
    if(turnOrder.length == 2) { return result.filter(a=>a.leaves < 4)}
    return result;
  };

  const LeafToken = (pile: ScoreTokenPile) => {
    const size = 80;
    const scale = 0.6;
    const color = pile.topValue ? tileColor(4 - pile.leaves) : "lightgrey";

    const icon = (leaves:number)=>{
      switch (leaves) {
        case 1: return EmptyOneLeaf
        case 2: return EmptyTwoLeaf
        case 3: return EmptyThreeLeaf
        case 4: return EmptyFourLeaf
      }
    }

    return (
        <Avatar style={{backgroundColor: color}}><SvgIcon fontSize="large"><svg
          className={classes.svg}
          xmlns="http://www.w3.org/2000/svg"
          viewBox={`0 0 ${size} ${size}`}
        >
          <circle cx={Math.ceil(size/2)-1}
                  cy={Math.ceil(size/2)-1}
                  r={0.8 * size / 2}
                  stroke={color}
                  strokeWidth = {2}
                  fill={"rgba(255,255,255,0.9)" } />
          <image href={icon(pile.leaves)} x={(size*(1-scale)*0.5)} y={(
            size * (1 - scale) * 0.5)} width={size*scale} height={size*scale} fill={"#ffffff"}/>
        </svg>
        </SvgIcon></Avatar>
    );
  };

  return (
    <CollapsingBox title="Scoring Tokens">
        <Grid container spacing={2} direction={"column"}>
          <Grid spacing={2} container direction="row" item>
            <Grid item>
              <Typography variant={"caption"}>Leaves</Typography>
            </Grid>
            <Grid item>
              <Typography variant={"caption"}>Next</Typography>
            </Grid>
            <Grid item>
              <Typography variant={"caption"}>Remaining</Typography>
            </Grid>
          </Grid>
          {tokenDisplay().map((pile, index) => (
            <Grid
              spacing={2}
              container
              direction="row"
              item
              key={`${pile.leaves}-${pile.topValue}-${index}`}
            >
              <Grid item>
                {" "}
                <LeafToken {...pile} />
              </Grid>
              <Grid item>
                <Avatar
                  style={{
                    backgroundColor: pile.topValue
                      ? tileColor(4 - pile.leaves)
                      : "lightgrey"
                  }}
                >
                  {pile.topValue ?? "--"}
                </Avatar>
              </Grid>
              <Grid item>
                <Avatar>{pile.remaining ?? "--" }</Avatar>

              </Grid>
            </Grid>
          ))}
        </Grid>
    </CollapsingBox>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  divider: {
    marginBottom: theme.spacing(1)
  },
  svg: {
    pointerEvents: "none"
  },

}));

export default ScoreTokenPiles;
