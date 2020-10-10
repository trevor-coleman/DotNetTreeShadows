import React from 'react'
import BoardTile from "./BoardTile";
import {PieceType} from "../../store/board/types/pieceType";
import {TreeType} from "../../store/board/types/treeType";
import {SvgIcon} from "@material-ui/core";

interface Props {
    pieceType: PieceType;
    treeType: TreeType;
    outlined?: boolean;
    size?: number;
    sizeFactor?: number;
}


const SvgTreeIcon = (props:Props) => {
    const {pieceType, treeType, outlined, sizeFactor} = props;
    return ( <SvgIcon><svg xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${24} ${24}`}>
        <BoardTile
            outline={outlined}
            pieceType={pieceType}
            treeType={treeType}
            sizeFactor={sizeFactor}/>
    </svg></SvgIcon>)
}

export default SvgTreeIcon;
