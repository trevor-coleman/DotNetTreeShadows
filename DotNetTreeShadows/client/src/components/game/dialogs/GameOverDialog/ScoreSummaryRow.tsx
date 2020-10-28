import React, { FunctionComponent } from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import {
  ListItem, Typography, ListItemSecondaryAction, IconButton,
} from '@material-ui/core';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import EmojiAward from './EmojiAward';
import ListItemText from '@material-ui/core/ListItemText';
import Grid from '@material-ui/core/Grid';
import ScoringTokenAvatar from '../../playerSidebar/ScoringTokenAvatar';
import Avatar from '@material-ui/core/Avatar';
import { ScoreDisplayInfo } from './GameOverDialog';
import { compareTokens } from '../../../helpers/compareTokens';
import Color from 'color';
import treeColor from '../../../helpers/treeColor';
import { useTypedSelector } from '../../../../store';
import PersonAddIcon from '@material-ui/icons/PersonAdd';

interface ScoreSummaryRowProps {
  info: ScoreDisplayInfo;
  index: number,
}

//COMPONENT
const ScoreSummaryRow: FunctionComponent<ScoreSummaryRowProps> = (props: ScoreSummaryRowProps) => {
  const {info, index} = props;
  const {id} = info;
  const theme = useTheme();
  const classes = useStyles();
  const playerBoard = useTypedSelector(state => state.playerBoards[id]);
  const playerName = useTypedSelector(state => state.session.players[id].name);

  const color: Color<string> = new Color(treeColor(playerBoard.treeType));

  return (
      <>
        <ListItem key={info.id}>
          <ListItemAvatar>
            <EmojiAward index={index} />
          </ListItemAvatar>
          <ListItemText>
            <Grid container direction={"column"} className={classes.playerName}>
              <Grid item>
            <Typography variant={"h5"} >
              {playerName.charAt(0)
                   .toUpperCase() + playerName.slice(1)}
            </Typography>
              </Grid>
              <Grid item className={classes.scoreTokens}>
                <Grid container spacing={2} direction={"row"}>
                  {info.tokens
                       .slice()
                       .sort(compareTokens)
                       .map((token, index) => (
                           <Grid item
                                 key={`${token.leaves}-${token.points}-${index}`}>
                             <ScoringTokenAvatar size={32} token={token} />
                           </Grid>))}
                  <Grid item>
                    <ScoringTokenAvatar light
                                        size={32}
                                        score={info.lightPoints} />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </ListItemText>

          <ListItemAvatar>
            <Avatar variant={"rounded"} style={{
              color: theme.palette.getContrastText(color.toString()),
              backgroundColor: color.toString(),
            }}>
              {info.totalScore}
            </Avatar>
          </ListItemAvatar>
          <ListItemSecondaryAction>
            <IconButton><PersonAddIcon/></IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      </>
  )
};

const useStyles = makeStyles((theme: Theme) => (
    {
      root: {},
      playerName: {
        marginLeft: theme.spacing(1)
      },
      scoreTokens: {
        marginTop: theme.spacing(1),
        marginLeft: theme.spacing(3)
      }
    }));

export default ScoreSummaryRow;
