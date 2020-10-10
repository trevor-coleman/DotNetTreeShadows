import React from "react";
import BoardTile from "./BoardTile";
import PlayerBoard from "../../store/game/types/playerBoard";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {PieceType} from "../../store/board/types/pieceType";
import {TreeType} from "../../store/board/types/treeType";

interface Props {
    pieceType: PieceType;
    treeType: TreeType;
    outlined?: boolean;
    size?: number;
    sizeFactor?: number;
};

const WrappedBoardTile = (props:Props)=> {
    const {pieceType, treeType, outlined, sizeFactor} = props;
    const classes=useStyles(props);
    return (<div className={classes.availablePiece}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${120} ${120}`}>
            <BoardTile
                outline={outlined}
                pieceType={pieceType}
                treeType={treeType}
                sizeFactor={sizeFactor}/>
        </svg>
    </div>)
}

const useStyles = makeStyles({
    availablePiece: {
        width: (props:Props)=>props.size ?? 50,
        height: (props:Props)=>props.size ?? 50,
        display: "inline-block",
        pointerEvents: "none"
    }
})


export default WrappedBoardTile;
