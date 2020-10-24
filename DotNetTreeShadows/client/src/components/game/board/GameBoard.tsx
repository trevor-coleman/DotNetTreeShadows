import React, {FunctionComponent} from 'react';
import {useDispatch} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import {HexLayout} from '../../../store/board/types/HexLayout';
import {Orientation} from '../../../store/board/types/Orientation';
import BoardTile from './BoardTile';
import {Hex} from '../../../store/board/types/Hex';
import {useTypedSelector} from "../../../store";
import Box from "@material-ui/core/Box";
import handleTileClick from "../../../store/game/gameActions/handleTileClick";


interface IGameBoardProps {
    width?: number | string
}

//COMPONENT
const GameBoard: FunctionComponent<IGameBoardProps> = (props: IGameBoardProps) => {
    useStyles(props);
    useDispatch();

    const {tiles} = useTypedSelector(state => state.board);


    const size = 2000;
    const aspect = 0.87;
    const viewPortSize = {
        x: size,
        y: size * aspect
    }
    const middle = size / 2;
    const origin = {
        x: middle,
        y: middle * aspect
    };
    const zoom = 17;
    const tileSize = {
        x: size / zoom,
        y: size / zoom
    }
    const buffer = 20;

    const points = [];
    for (let i = 0; i < 360; i += 60) {
        const radians = Math.PI / 180 * i
        points.push({
            x: origin.x + (size - buffer) / 2 * Math.cos(radians),
            y: origin.y + (size - buffer) / 2 * Math.sin(radians)
        })
    }

    let pointString = "";
    for (let i = 0; i < points.length; i++) {
        pointString += `${points[i].x}, ${points[i].y} `;
    }

    const layout = new HexLayout(Orientation.Pointy, tileSize, origin)

    return (
        <Box p={2}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${viewPortSize.x} ${viewPortSize.y}`}>
              <defs>
                <radialGradient id="grad1"
                                cx="50%"
                                cy="50%"
                                r="50%"
                                fx="50%"
                                fy="50%">
                  <stop offset="6%" style={
                    {stopColor: "#2b7224",
                      stopOpacity:1
                    }} />
                  <stop offset="24%" style={{
                    stopColor: "#418b3b",
                    stopOpacity: 1
                  }} />
                  <stop offset="48%" style={{
                    stopColor: "#628b53",
                    stopOpacity: 1
                  }} />
                  <stop offset="64%" style={{
                    stopColor: "#759a6b",
                    stopOpacity: 1
                  }} />
<stop offset="86%" style={{
                    stopColor: "#919a6b",
                    stopOpacity: 1
                  }} />
                  <stop offset="100%"
                        style={{stopColor:"#d3ba8d", stopOpacity:1}} />
                </radialGradient>
              </defs>
              <polyline id="hexagon" points={pointString} fill={"url(#grad1)"}/>
                {tiles ? Object.keys(tiles).map(hexCodeString => {
                    const hexCode = parseInt(hexCodeString);
                    new Hex(hexCode);
                    return <BoardTile key={hexCode} onClick={async () => {
                        handleTileClick(hexCode);
                    }
                    }
                                      hexCode={hexCode} layout={layout}/>;
                }) : ""}</svg>
        </Box>);
};

const useStyles = makeStyles({root: {}});

export default GameBoard;
