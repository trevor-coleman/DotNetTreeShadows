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
import FocusMask from './FocusMask';
import { useFocus } from '../../../store/board/reducer';
import TileShadow from './TileShadow';


interface IGameBoardProps {
    width?: number | string

}

//COMPONENT
const GameBoard: FunctionComponent<IGameBoardProps> = (props: IGameBoardProps) => {
    useStyles(props);
    useDispatch();
    const focus = useFocus();

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

    const nextPoints = [];
    for (let i = 0; i < 360; i += 60) {
        const radians = Math.PI / 180 * i
        nextPoints.push({
            x: origin.x + (size - buffer) / 2 * Math.cos(radians),
            y: origin.y + (size - buffer) / 2 * Math.sin(radians)
        })
    }

    let nextPointString = "";
    for (let i = 0; i < nextPoints.length; i++) {
        nextPointString += `${points[i].x}, ${points[i].y} `;
    }

    const layout = new HexLayout(Orientation.Pointy, tileSize, origin)

    return (
      <Box p={2}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox={`0 0 ${viewPortSize.x} ${viewPortSize.y}`}
        >
          <defs>
            <filter id="shadow" width="1.5" height="1.5" x="-.5" y="-.5">
              <feGaussianBlur in="SourceAlpha"
                              stdDeviation="2.5"
                              result="blur" />
              <feColorMatrix result="bluralpha" type="matrix" values="1 0 0 0   0
             0 1 0 0   0
             0 0 1 0   0
             0 0 0 0.4 0 " />
              <feOffset in="bluralpha" dx="3" dy="3" result="offsetBlur" />
              <feMerge>
                <feMergeNode in="offsetBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <radialGradient
              id="grad1"
              cx="50%"
              cy="50%"
              r="50%"
              fx="50%"
              fy="50%"
            >
              <stop
                offset="6%"
                style={{ stopColor: "#2b7224", stopOpacity: 1 }}
              />
              <stop
                offset="24%"
                style={{
                  stopColor: "#418b3b",
                  stopOpacity: 1
                }}
              />
              <stop
                offset="48%"
                style={{
                  stopColor: "#628b53",
                  stopOpacity: 1
                }}
              />
              <stop
                offset="64%"
                style={{
                  stopColor: "#759a6b",
                  stopOpacity: 1
                }}
              />
              <stop
                offset="85%"
                style={{
                  stopColor: "#919a6b",
                  stopOpacity: 1
                }}
              />
              <stop
                offset="100%"
                style={{ stopColor: "#d3ba8d", stopOpacity: 1 }}
              />
            </radialGradient>

            <mask
              id="focus-clip"
              x={0}
              y={0}
              width={size}
              height={size}
              maskUnits={"userSpaceOnUse"}
              maskContentUnits={"userSpaceOnUse"}
            >
              <polyline
                id="hexagon"
                points={pointString}
                fill={"#fff"}
                mask="url(#focus-clip)"
                pointerEvents={"none"}
              />

              {focus.on
                ? focus.tiles.map(h => (
                    <FocusMask
                      key={`focusMask-${h}`}
                      hexCode={h}
                      layout={layout}
                    />
                  ))
                : ""}
              {focus.originHexCode ? (
                <FocusMask hexCode={focus.originHexCode} layout={layout} />
              ) : (
                ""
              )}
            </mask>
          </defs>

          <polyline id="hexagon" points={pointString} fill={"url(#grad1)"} />

          {tiles
           ? Object.keys(tiles).map(hexCodeString => {
                const hexCode = parseInt(hexCodeString);
                new Hex(hexCode);
                return (
                    <TileShadow key={hexCode} hexCode={hexCode} layout={layout} />);
              })
           : ""}

          {tiles
            ? Object.keys(tiles).map(hexCodeString => {
                const hexCode = parseInt(hexCodeString);
                new Hex(hexCode);
                return (
                  <BoardTile
                    key={hexCode}
                    onClick={async () => {
                      handleTileClick(hexCode);
                    }}
                    hexCode={hexCode}
                    layout={layout}
                  />
                );
              })
            : ""}

          {focus.on ? (
            <polyline
              id="hexagon"
              points={pointString}
              pointerEvents={"none"}
              fill={"rgba(0,0,0, 0.2)"}
              mask="url(#focus-clip)"
            />
          ) : (
            ""
          )}
        </svg>
      </Box>
    );
};

const useStyles = makeStyles({root: {}});

export default GameBoard;
