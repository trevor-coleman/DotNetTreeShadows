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
                <Piece status={"Ready"} size={size} price={PlayerBoard.currentPrice(boardCode, index).toString()} color={treeColor(PlayerBoard.TreeType(boardCode))} />
            </Grid>
            {col.map(({status, price, key}: PieceDetails) => (
                <Grid item className={classes.gridItem} key={key} onMouseEnter={()=>setHoverKey(key)} onMouseLeave={()=>setHoverKey("")}>
                    {hoverKey == key || status=="Empty" ? <Piece size={size}
                           status={status}
                           price={price}
                           color={treeColor(PlayerBoard.TreeType(boardCode))}
                    /> : <WrappedBoardTile pieceType={index as PieceType} treeType={PlayerBoard.TreeType(boardCode)} size={size} sizeFactor={1.1}/>}
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
