import React, {FunctionComponent} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import Box from "@material-ui/core/Box";
import {Typography} from "@material-ui/core";
import {useTypedSelector} from "../../store";
import PlayerBoard from "../../store/game/types/playerBoard";
import {PieceType, pieceTypeName} from "../../store/board/types/pieceType";
import BoardTile from "./BoardTile";
import Divider from "@material-ui/core/Divider";
import WrappedBoardTile from "./WrappedBoardTile";
import TreeAvatarIcon from "./TreeAvatarIcon";
import Grid from "@material-ui/core/Grid";


interface Props {
    width?: number
}


//COMPONENT
const AvailablePieces: FunctionComponent<Props> = (props: Props) => {
    const classes = useStyles(props);
    const dispatch = useDispatch();
    const boardCode = useTypedSelector(state => state.game.playerBoards[state.profile.id]);

    const available: number[] = PlayerBoard.available(boardCode);

    const availablePieces: { pieceType: PieceType, key: string }[][] = [];

    available.forEach((numberOfPieces, pieceType) => {
        let pieces = [];
        for (let i = 0; i < numberOfPieces; i++) {
            pieces.push({
                pieceType: pieceType as
                    PieceType,
                key: `${boardCode}-${pieceType}-${i}`
            });
        }
        availablePieces[pieceType] = pieces;
    });
    let lastPiece: { pieceType: PieceType, key: string };

    return <Box p={1} className={classes.root}>
        <Typography className={classes.pieceTypeName}>Available</Typography>
        <Grid direction={"column"} container>
            {availablePieces.map((pieces, index) => {
                return (
                    <div key={PieceType[index]}><Grid item container>
                        {pieces.map(piece => {
                            return (
                                <Grid item key={piece.key}>
                                    <Box m={1}>
                                        <TreeAvatarIcon
                                            pieceType={piece.pieceType}
                                            treeType={PlayerBoard.TreeType(boardCode)}
                                        />
                                    </Box>
                                </Grid>)
                        })
                        }
                    </Grid>
                        <Divider/></div>)
            })}
        </Grid>
    </Box>;
};


const useStyles = makeStyles({
    root: {
        width: (props: Props) => props.width ?? 250,
    },
    pieceWrapper: {
        display: "",
    },
    pieceTypeName: {
        display: "block",
        color: "lightgrey",

    },
    divider: {
        marginTop: 8,
        marginBottom: 8,
        display: "block"
    },
});

export default AvailablePieces;
