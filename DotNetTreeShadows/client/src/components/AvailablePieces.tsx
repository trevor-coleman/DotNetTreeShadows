import React, {FunctionComponent} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import Box from "@material-ui/core/Box";
import {Typography} from "@material-ui/core";
import {useTypedSelector} from "../store";
import PlayerBoard from "../store/game/types/playerBoard";
import {PieceType, pieceTypeName} from "../store/board/types/pieceType";
import BoardTile from "./game/BoardTile";
import Divider from "@material-ui/core/Divider";
import WrappedBoardTile from "./game/WrappedBoardTile";


interface Props {
    width?: number
}


//COMPONENT
const AvailablePieces: FunctionComponent<Props> = (props: Props) => {
    const classes = useStyles(props);
    const dispatch = useDispatch();
    const boardCode = useTypedSelector(state => state.game.playerBoards[state.profile.id]);


    const available: number[] = PlayerBoard.available(boardCode);

    const availablePieces: { pieceType: PieceType, key: string }[] = [];

    available.forEach((numberOfPieces, pieceType) => {
        for (let i = 0; i < numberOfPieces; i++) {
            availablePieces.push({
                pieceType: pieceType as
                    PieceType,
                key: `${boardCode}-${pieceType}-${i}`
            });
        }
    });
    let lastPiece:{ pieceType: PieceType, key: string };

    return <Box p={1} className={classes.root}>
        <Typography className={classes.pieceTypeName}>Available</Typography>
        {availablePieces.map((piece, index) => {
            // const top = (lastPiece?.pieceType != piece.pieceType) ? <><Box className={classes.pieceTypeName}>{pieceTypeName(piece.pieceType)}</Box> </> : "";
            const bottom = (index + 1 < availablePieces.length && availablePieces[index+1].pieceType != piece.pieceType) ? <><Divider className={classes.divider}/></> : "";
            lastPiece=piece;
            return (
                <div className={classes.pieceWrapper} key={piece.key}>
                    {/*{top}*/}
                    <WrappedBoardTile pieceType={piece.pieceType} treeType={PlayerBoard.TreeType(boardCode)}/>
                    {bottom}
                </div>)
        })}

    </Box>;
};



const useStyles = makeStyles({
    root: {
        width: (props: Props) => props.width ?? 250,
    },
    pieceWrapper: {
        display:"inline",
        alignSelf:"flex-end",
    },
    pieceTypeName: {
        display: "block",
        color:"lightgrey",

    }, divider: {
        marginTop: 8,
        marginBottom: 8,
        display:"block"
    }
});

export default AvailablePieces;
