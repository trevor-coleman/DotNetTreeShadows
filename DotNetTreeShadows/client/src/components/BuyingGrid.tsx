import React, { FunctionComponent } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../store';
import { makeStyles } from '@material-ui/core/styles';
import Piece, { IPieceProps } from './Piece';
import { Grid, Paper } from '@material-ui/core';
import { PieceType } from '../store/sessions/types';
import DebugToolbar from './DebugToolbar';
import SessionCreator from './SessionCreator';
import Typography from '@material-ui/core/Typography';
import SVGTreeToken from './SVGTreeToken';


//REDUX MAPPING
const mapStateToProps = (state: RootState) => {
  return {
    session: state.session,
    playerBoards: state?.session?.session?.game?.playerBoards,
    playerId: state.system.id,
  };
};

const mapDispatchToProps = {};

//REDUX PROP TYPING
const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

interface IBuyingGridProps {}

type BuyingGridProps = IBuyingGridProps & PropsFromRedux;

//COMPONENT
const BuyingGrid: FunctionComponent<BuyingGridProps> = (props: BuyingGridProps) => {
  const classes = useStyles();

  const {playerId, session, playerBoards} = props;

  console.log(playerBoards);
  const playerBoard = playerBoards
                      ? playerBoards?.find(board => board.playerId == playerId)
                      : null;

  const pieceTypes: PieceType[] = ['Seed', 'SmallTree', 'MediumTree', 'LargeTree'];
  const spaces = {
    Seed: 4,
    SmallTree: 4,
    MediumTree: 3,
    LargeTree: 2.,
  };

  console.group("PLAYERBOARD");
  console.log("Pieces");
  console.log(typeof (
    playerBoard?.pieces));
  if (playerBoard) {
    pieceTypes.forEach(pt => {
      console.log(pt, playerBoard.pieces[pt]);
    });
  }
  console.groupEnd();

  const size: number = 50;

  const pieceColumns: IPieceProps[][] = [];

  pieceTypes.forEach(pt => {
    const column: IPieceProps[] = [];
    const onPlayerBoard = playerBoard?.pieces[pt].onPlayerBoard ?? 0;
    for (let i = 0; i < spaces[pt]; i++) {
      column.push({
        status: i == onPlayerBoard - 1
                ? "Ready"
                : i < onPlayerBoard - 1
                  ? "Filled"
                  : "Empty",
        price: playerBoard?.pieces[pt].prices[i].toString() ?? "",
        size: size,
      });
    }

    pieceColumns.push(column);

  });

  const onBoardPieces: { [key: string]: number } = {};

  const ground:"Ground" = "Ground"

  return <>
    <DebugToolbar />
    <SessionCreator />
     <Paper className={classes.paper}>
       <Typography variant="h6">{session?.session?.name ?? "no session"}
       </Typography>
       {playerBoard
        ?
       <Grid container direction={'row'} spacing={2}>
         {pieceColumns.map((col, index) => <Grid item>
           <Grid container item direction={'column'} spacing={2}>
             {col.map(({size, status, price}: IPieceProps) => <Grid item><Piece size={size}
                                                                                status={status}
                                                                                price={price} /></Grid>)}
           </Grid>
         </Grid>)}
       </Grid>
        : ""}
     </Paper>

  </>;
};

const useStyles = makeStyles({
  paper: {
    margin: 20,
    padding: 20,
  },
});

export default connector(BuyingGrid);
