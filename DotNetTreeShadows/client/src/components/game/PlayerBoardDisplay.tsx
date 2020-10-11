import React, {FunctionComponent} from 'react';
import {useSelector} from 'react-redux';
import {RootState} from '../../store/store';
import {createStyles, makeStyles, Theme, useTheme} from '@material-ui/core/styles';
import Piece from './Piece';
import {Grid, Typography} from '@material-ui/core';
import {PieceType} from "../../store/board/types/pieceType";
import PlayerBoard, {PieceDetails} from "../../store/game/types/playerBoard";
import treeColor from "./treeColor";
import BoardTile from "./BoardTile";
import Box from "@material-ui/core/Box";
import {ClassNameMap} from "@material-ui/core/styles/withStyles";
import PiecesGrid from "./PiecesGrid";
import AvailablePieces from "./AvailablePieces";
import Divider from "@material-ui/core/Divider";
import Paper from "@material-ui/core/Paper";
import LightDisplay from "./LightDisplay";

interface BuyingGridProps {
    width?: number
};


const PlayerBoardDisplay: FunctionComponent<BuyingGridProps> = (props: BuyingGridProps) => {
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

    return boardCode ? <Box p={2} className={classes.paper}>
        <Grid container direction={'column'}>
            <Grid item><LightDisplay/></Grid>
            <Divider/>
            <Grid item><Typography className={classes.playerBoardTitle}>Player Board</Typography></Grid>
        <Grid container direction={'row'} spacing={1}>
            {PlayerBoard.MakeGrid(newBoardCode).map((col, index) => {
                console.log()
                return <PiecesGrid key={`${boardCode}-${index}-${col}`}index={index} col={col} boardCode={boardCode} size={size}/>
            })}
            </Grid>
            <Grid>
                <Box className={classes.available}><Divider/><AvailablePieces/></Box>
            </Grid>
        </Grid>
    </Box> : <div/>
};

const useStyles = makeStyles((theme: Theme) => createStyles({
    paper: {},
    available: {marginTop: 16},
    playerBoardTitle: {
        marginTop:16
    }

}));

export default PlayerBoardDisplay;
