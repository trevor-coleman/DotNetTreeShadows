import PlayerBoard, {PieceDetails} from "../../../store/game/types/playerBoard";
import {Grid} from "@material-ui/core";
import {PieceType} from "../../../store/board/types/pieceType";
import React, {useState} from "react";
import {makeStyles} from '@material-ui/core/styles';
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

    return(
        <Grid container item direction={'column'} spacing={1}>
            <Grid item>
                <TreeAvatarIcon treeType={PlayerBoard.TreeType(boardCode)} pieceType={index as PieceType} gridHeader/>
            </Grid>
            {col.map(({status, price, key}: PieceDetails) => (
                <Grid item className={classes.gridItem} key={key} onMouseEnter={() => setHoverKey(key)}
                      onMouseLeave={() => setHoverKey("")}>
                    <TreeAvatarIcon treeType={PlayerBoard.TreeType(boardCode)}
                                    text={hoverKey == key || status == "Empty" ? price : ""} empty={status == "Empty"}
                                    pieceType={index as PieceType}/>
                </Grid>
            ))}
        </Grid>);
}

const useStyles = makeStyles({
    root: {},
    gridItem: {
        height: 50
    },
    piece: {
        width: 50
    }
})


export default PiecesGrid;
