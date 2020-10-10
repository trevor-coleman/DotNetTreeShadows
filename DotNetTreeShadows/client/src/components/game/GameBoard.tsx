import React, {FunctionComponent} from 'react';
import {connect, ConnectedProps, useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../store/store';
import {makeStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import {HexLayout} from '../../store/board/types/HexLayout';
import {Orientation} from '../../store/board/types/Orientation';
import BoardTile from './BoardTile';

import {Hex} from '../../store/board/types/Hex';
import {PieceType} from "../../store/board/types/pieceType";
import {TreeType} from "../../store/board/types/treeType";
import {addPieceToHex} from '../../store/board/reducer';
import Typography from "@material-ui/core/Typography";
import {useTypedSelector} from "../../store";
import Box from "@material-ui/core/Box";


interface IGameBoardProps {
    width?: number | string
}

//COMPONENT
const GameBoard: FunctionComponent<IGameBoardProps> = (props: IGameBoardProps) => {
    const classes = useStyles(props);
    const dispatch = useDispatch();

    const {tiles} = useTypedSelector(state=> state.board);
    const {name:sessionName} = useTypedSelector(state=>state.session)

    const size = 2000;
    const aspect = 0.87;
    const viewPortSize = {x: size, y: size*aspect}
    const middle = size/2;
    const origin = {x:middle, y:middle*aspect};
    const zoom = 17;
    const tileSize = {x:size/zoom, y:size/zoom}
    const buffer = 20;

    const points = [];
    for(let i=0; i<360; i+=60) {
        const radians = Math.PI / 180 * i
        points.push({
            x: origin.x + (size-buffer)/2 * Math.cos(radians),
            y: origin.y + (size-buffer)/2 * Math.sin(radians)
        })
    }

    let pointString = "";
    for(let i =0; i<points.length; i++) {
        pointString += `${points[i].x}, ${points[i].y} `;
    }

    const layout = new HexLayout(Orientation.Pointy, tileSize, origin )

    return <Paper className={classes.root}>
        <Box p={2}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${viewPortSize.x} ${viewPortSize.y}`}>
            <polyline id="hexagon" points={pointString} fill={"#c7ec94"}/>
            {tiles ? Object.keys(tiles).map(hexCode => {
                const h = new Hex(parseInt(hexCode));
                return <BoardTile key={hexCode} onClick={(thisHexCode:number) => dispatch(addPieceToHex({
                    hexCode: thisHexCode,
                    treeType: TreeType
                        .Ash,
                    pieceType: PieceType
                        .MediumTree}))}
                 hexCode={parseInt(hexCode)} layout={layout}/>;
            }) : ""}</svg>
        </Box>
    </Paper>;
};

const useStyles = makeStyles({root: {width:'90vmin'}});

export default GameBoard;
