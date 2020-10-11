import PlayerBoard, {PieceDetails} from "../../store/game/types/playerBoard";
import {ClassNameMap} from "@material-ui/core/styles/withStyles";
import {Grid, Typography} from "@material-ui/core";
import BoardTile from "./BoardTile";
import {PieceType} from "../../store/board/types/pieceType";
import Piece from "./Piece";
import treeColor from "./treeColor";
import React, {useState} from "react";
import {createStyles, makeStyles, Theme, useTheme} from '@material-ui/core/styles';
import WrappedBoardTile from "./WrappedBoardTile";
import TreeAvatarIcon from "./TreeAvatarIcon";

interface Props {
    index: number,
    col: PieceDetails[],
    boardCode: number,
    size: number
}

const PiecesGrid = (props: Props) => {
    const {index, col, boardCode, size} = props
    const classes = useStyles()
    const [hoverKey, setHoverKey] = useState("")

    return <Grid item key={index.toString() + col.toString()} className={classes.root}>
        <Grid container item direction={'column'} spacing={1}>
            <Grid item>
                <TreeAvatarIcon treeType={PlayerBoard.TreeType(boardCode)} pieceType={index as PieceType} gridHeader/>
            </Grid>
            {col.map(({status, price, key}: PieceDetails) => (
                <Grid item className={classes.gridItem} key={key} onMouseEnter={()=>setHoverKey(key)} onMouseLeave={()=>setHoverKey("")}>
                     <TreeAvatarIcon treeType={PlayerBoard.TreeType(boardCode)} text={hoverKey == key || status=="Empty" ? price : ""}  empty={status=="Empty"} pieceType={index as PieceType}/>
                </Grid>
            ))}
        </Grid>
    </Grid>;
}

const useStyles = makeStyles({
    root:{
        marginTop: 16,
        marginBottom: 16
    },
    gridItem:{
        height: 60
    },
    piece: {
        width: 50
    }})


export default PiecesGrid;
