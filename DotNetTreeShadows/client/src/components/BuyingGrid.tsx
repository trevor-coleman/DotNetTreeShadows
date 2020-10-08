import React, {FunctionComponent} from 'react';
import {useSelector} from 'react-redux';
import {RootState} from '../store';
import {createStyles, makeStyles, Theme, useTheme} from '@material-ui/core/styles';
import Piece from './Piece';
import {Grid} from '@material-ui/core';
import {PieceType} from "../store/board/pieceType";
import PlayerBoard, {PieceDetails} from "../store/game/playerBoard";
import treeColor from "./treeColor";
import BoardTile from "./BoardTile";

interface BuyingGridProps {
    width?: number
};

const BuyingGrid: FunctionComponent<BuyingGridProps> = (props: BuyingGridProps) => {
    let {width} = props;
    width = width || 250;
    const classes = useStyles();
    const theme = useTheme();

    const playerId = useSelector((state: RootState) => state.profile.id);
    const boardCode = useSelector((state: RootState) => state.game.playerBoards[playerId]);
    const {name: sessionName} = useSelector((state: RootState) => state.session);


    const size: number = width / 6


    const onBoardPieces: { [key: string]: number } = {};

    const ground: "Ground" = "Ground"

    let newBoardCode = PlayerBoard.getPieces(boardCode, PieceType.MediumTree).decreaseOnPlayerBoard();
    newBoardCode = PlayerBoard.getPieces(newBoardCode, PieceType.MediumTree).decreaseOnPlayerBoard();
    newBoardCode = PlayerBoard.getPieces(newBoardCode, PieceType.SmallTree).decreaseOnPlayerBoard();
    newBoardCode = PlayerBoard.getPieces(newBoardCode, PieceType.MediumTree).increaseOnPlayerBoard();

    return boardCode ? <div className={classes.paper}>
        <Grid container direction={'row'} spacing={1}>
            {PlayerBoard.MakeGrid(newBoardCode).map((col, index) => {
                console.log()
                return <Grid item key={index.toString() + col.toString()}>
                    <Grid container item direction={'column'} spacing={1}>
                        <Grid item>
                            <div className={classes.piece}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${120} ${120}`}>
                                    <BoardTile
                                        outline
                                        pieceType={index as PieceType}
                                        treeType={PlayerBoard.TreeType(boardCode)}
                                    /></svg>
                            </div>
                        </Grid>
                        {col.map(({status, price, key}: PieceDetails) => <Grid item key={key}><Piece size={size}
                                                                                                     status={status}
                                                                                                     price={price}
                                                                                                     color={treeColor(PlayerBoard.TreeType(boardCode))}/></Grid>)}
                    </Grid>
                </Grid>
            })}
        </Grid>
    </div> : <div/>
};

const useStyles = makeStyles((theme: Theme) => createStyles({
    paper: {
        width: "fit-content",
        marginTop: 20,
        padding: 20,
    },
    piece: {
        width: 50
    }
}));

export default BuyingGrid;
