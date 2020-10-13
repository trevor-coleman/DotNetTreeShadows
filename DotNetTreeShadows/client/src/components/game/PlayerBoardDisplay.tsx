import React, {FunctionComponent} from 'react';
import {useSelector} from 'react-redux';
import {RootState} from '../../store/store';
import {createStyles, makeStyles, Theme, useTheme} from '@material-ui/core/styles';
import {Grid, Typography} from '@material-ui/core';
import {PieceType} from "../../store/board/types/pieceType";
import PlayerBoard from "../../store/game/types/playerBoard";
import Box from "@material-ui/core/Box";
import PiecesGrid from "./PiecesGrid";
import AvailablePieces from "./AvailablePieces";
import Paper from "@material-ui/core/Paper";

interface BuyingGridProps {
    width?: number
}


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

    return boardCode ? <Box m={2} className={classes.paper}>
        <Grid container direction={'column'}>
            <Paper><Box p={2}>
                <Typography variant={"h6"} className={classes.title}>Player Board</Typography>

                <Grid container direction={'row'} spacing={2}>
                {PlayerBoard.MakeGrid(newBoardCode).map((col, index) => {
                    console.log()
                    return <PiecesGrid key={`${boardCode}-${index}-${col}`}index={index} col={col} boardCode={boardCode} size={size}/>
                })}
            </Grid></Box></Paper>
            <Grid>
                <Paper><Box p={2} className={classes.available}><AvailablePieces/></Box></Paper>
            </Grid>
        </Grid>
    </Box> : <div/>
};

const useStyles = makeStyles((theme: Theme) => createStyles({
    paper: {},
    title: {
      marginBottom:theme.spacing(1),
    },
    available: {marginTop: 16},
    playerBoardTitle: {
        marginTop:16
    }

}));

export default PlayerBoardDisplay;
