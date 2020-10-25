import React, {FunctionComponent} from 'react';
import {useSelector} from 'react-redux';
import {RootState} from '../../../store/store';
import {createStyles, makeStyles, Theme, useTheme} from '@material-ui/core/styles';
import {Grid, Typography} from '@material-ui/core';
import {PieceType} from "../../../store/board/types/pieceType";
import PlayerBoard from "../../../store/game/types/playerBoard";
import Box from "@material-ui/core/Box";
import PiecesGrid from "./PiecesGrid";
import AvailablePieces from "./AvailablePieces";
import Paper from "@material-ui/core/Paper";
import Divider from "@material-ui/core/Divider";
import CollapsingBox from '../../CollapsingBox';

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


    const size: number = width / 4.5


    const onBoardPieces: { [key: string]: number } = {};

    const ground: "Ground" = "Ground"


    return boardCode ?
        <CollapsingBox title="Player Board">
                <Box className={classes.gridBox}><Grid container direction={'row'} spacing={2}>
                    {PlayerBoard.MakeGrid(boardCode).map((col, index) => {

                        return <Grid className={classes.grid} item key={index.toString() + col.toString()}>
                            <PiecesGrid
                                key={`${boardCode}-${index}-${col}`} index={index}
                                col={col}
                                size={size}/>
                        </Grid>
                    })}
                </Grid>
                </Box>
        </CollapsingBox>
        : <div/>
};

const useStyles = makeStyles((theme: Theme) => createStyles({
    paper: {},
    title: {
        marginBottom: theme.spacing(1),
    },
    available: {marginTop: theme.spacing(2)},
    playerBoardTitle: {
        marginTop: theme.spacing(2)
    },
    divider: {
        marginBottom: theme.spacing(1)
    },
    gridBox: {
        width: "100%",
    },
    grid: {
        flexGrow:1,
    }

}));

export default PlayerBoardDisplay;
