import React, { FunctionComponent } from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Emoji from 'a11y-react-emoji';

interface EmojiAwardProps {
  index:number
}

//COMPONENT
const EmojiAward: FunctionComponent<EmojiAwardProps> = ({index}: EmojiAwardProps) => {
  const classes=useStyles();
  let emoji;
  switch (index) {
    case 0:
      emoji = {
        symbol: "🏆",
        label: "trophy"
      };
      break;
    case 1:
      emoji = {
        symbol: "🥈",
        label: "silver medal"
      };
      break;
    case 2:
      emoji = {
        symbol: "🥉",
        label: "bronze medal"
      };
      break;
    case 3:
      emoji = {
        symbol: "🙈",
        label: "see-no-evil monkey"
      };
      break;
    default:
      emoji = {
        symbol: "⚠️",
        label: "warning"
      };
      break;
  }

  return (
    <Avatar style={{  }} className={classes.avatar}>
      <Emoji {...emoji} className={classes.emoji} />
    </Avatar>
  );
};

const useStyles = makeStyles((theme: Theme) => (
    {
      avatar: {
        backgroundColor: "rgba(0,0,0,0)",
        width: 64,
        height: 64,
      },
      emoji: {
        fontSize: 48
      },
    }));

export default EmojiAward;
