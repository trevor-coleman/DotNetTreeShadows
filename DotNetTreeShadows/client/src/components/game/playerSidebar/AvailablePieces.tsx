import React, {FunctionComponent} from 'react';
import {useDispatch} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import Box from "@material-ui/core/Box";
import {Typography} from "@material-ui/core";
import {useTypedSelector} from "../../../store";
import PlayerBoard from "../../../store/game/types/playerBoard";
import {PieceType} from "../../../store/board/types/pieceType";
import Divider from "@material-ui/core/Divider";
import TreeAvatarIcon from "./TreeAvatarIcon";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";


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

    return <Paper><Box p={2} className={classes.root}>
        <Typography variant={"h6"}>Available</Typography>
        <Divider className={classes.divider}/>
        <Grid direction={"column"} container>
            {availablePieces.map((pieces, index) => {
                return (
                    <div key={PieceType[index]}><Grid item container>
                        {pieces.map(piece => {
                            return (
                                <Grid item key={piece.key}>
                                    <Box m={0.5}>
                                        <TreeAvatarIcon
                                            pieceType={piece.pieceType}
                                            treeType={PlayerBoard.TreeType(boardCode)}
                                        />
                                    </Box>
                                </Grid>)
                        })
                        }
                    </Grid>
                    </div>)
            })}
        </Grid>
    </Box></Paper>;
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
        marginTop: 4,
        marginBottom: 4,
        display: "block"
    },
});

export default AvailablePieces;
