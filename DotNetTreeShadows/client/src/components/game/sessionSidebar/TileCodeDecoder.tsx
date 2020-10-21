import React, {FunctionComponent, useState} from 'react';
import {useDispatch} from 'react-redux';
import {makeStyles, Theme} from '@material-ui/core/styles';
import {Divider, Paper} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import Tile from "../../../store/board/types/tile";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import {TreeType} from "../../../store/board/types/treeType";
import {PieceType} from "../../../store/board/types/pieceType";
import ListItemText from "@material-ui/core/ListItemText";


interface TileCodeDecoderProps {
}

//COMPONENT
const TileCodeDecoder: FunctionComponent<TileCodeDecoderProps> = (props: TileCodeDecoderProps) => {
  const {} = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const [code, setCode] = useState(22);

  const handleChange = (s: string):void=> {
    const re = /^[0-9\b]+$/;
    if (re.test(s)) {
      setCode( parseInt(s));
    } else if (s == '' ){
      setCode(0)
    }
  }

  const pieceType = PieceType[Tile.GetPieceType(code) ?? 0 ];
  const treeType = TreeType[Tile.GetTreeType(code) ?? 0 ];
  const shadowHeight = Tile.GetShadowHeight(code) ?? 0
  const tileTypeCode: number = Tile.GetTileType(code) ?? 0;

  let tileType = "not set"
  switch (tileTypeCode) {
    case 0:
      tileType = "empty";
      break;
    case 1:
      tileType="Tree";
      break;
case 2:
      tileType="Sky";
      break;
case 3:
      tileType="Sun";
      break;
  }


  return (
    <Paper className={classes.root}>
      <Box p={2}>TileCodeDecoder
        <Box m={1}><TextField
          required
          id="code"
          label="tileCode"
          value={code}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e.target.value)}/></Box>
        <Box m={1}>{code.toString(2)}</Box>
        <Divider/>
        <List>
          <ListItem ><ListItemText primary={pieceType} secondary={"PieceType"}/></ListItem>
          <ListItem ><ListItemText primary={treeType} secondary={"TreeType"}/></ListItem>
          <ListItem ><ListItemText primary={shadowHeight} secondary={"Shadow Height"}/></ListItem>
          <ListItem ><ListItemText primary={tileType} secondary={"TileType"}/></ListItem>

        </List>

      </Box>
    </Paper>);
};

const useStyles = makeStyles((theme: Theme) => ({
  root: {}
}));

export default TileCodeDecoder;
