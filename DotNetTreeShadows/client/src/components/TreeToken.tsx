import React from 'react';
import { PieceType, TreeType } from '../store/sessions/types';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { IPieceProps } from './Piece';

interface TreeTokenProps {pieceType: PieceType, size: number, treeType: TreeType}

const TreeToken = (props:TreeTokenProps) => {
  const classes = useStyles(props);
  const {pieceType, treeType, size} = props;
  return <div className={classes.root}>{treeType}{pieceType}</div>
}

const sizeFromProps = ({size}: TreeTokenProps) => size;
const useStyles = makeStyles({
  root: {
    border: '1px solid blue',
    borderRadius: '100%',
    width: sizeFromProps,
    height:sizeFromProps,
  }
  }
)

export default TreeToken;
