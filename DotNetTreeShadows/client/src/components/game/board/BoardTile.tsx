import React from "react";
import Tile from "../../../store/board/types/tile";
import TreeSVG from "../../../svg/TreeSVG";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Sun from "../../../svg/sun-svgrepo-com.svg";
import { Hex } from "../../../store/board/types/Hex";
import { TreeType } from "../../../store/board/types/treeType";
import { PieceType } from "../../../store/board/types/pieceType";
import { HexLayout } from "../../../store/board/types/HexLayout";
import { SunPosition } from "../../../store/game/types/sunPosition";
import treeColor from "../../helpers/treeColor";
import Color from "color";
import { useTypedSelector } from "../../../store";
import { GameStatus } from "../../../store/game/types/GameStatus";
import { useTile, useFocus } from "../../../store/board/reducer";
import { useSunPosition } from "../../../store/game/reducer";
import {
  PlayerBoardInfo,
  usePlayerBoard
} from "../../../store/playerBoard/reducer";
import EmptyOneLeaf from "../../../svg/exports/Empty-OneLeaf.svg";
import EmptyTwoLeaf from "../../../svg/exports/Empty-TwoLeaf.svg";
import EmptyThreeLeaf from "../../../svg/exports/Empty-ThreeLeaf.svg";
import EmptyFourLeaf from "../../../svg/exports/Empty-FourLeaf.svg";

interface IBoardTileProps {
  onClick?: (hexCode: number) => void;
  onMouseEnter?: (hexCode: number) => void;
  onMouseLeave?: (hexCode: number) => void;
  hexCode?: number;
  layout?: HexLayout;
  pieceType?: PieceType;
  treeType?: TreeType;
  outline?: boolean;
  sizeFactor?: number;
}

const BoardTile = (props: IBoardTileProps) => {
  const {
    outline,
    onClick,
    onMouseEnter,
    onMouseLeave,
    layout,
    pieceType: propPiece,
    treeType: propTree
  } = props;
  const sizeFactor = props.sizeFactor ?? 1.2;
  const playerBoard: PlayerBoardInfo = usePlayerBoard();

  const hexCode = props.hexCode ? props.hexCode : 0;
  const tileCode = useTile(hexCode);
  const sunPosition: SunPosition = useSunPosition();
  const {
    status,
    turnOrder,
    currentTurn,
    gameOptions,
    currentActionType,
    tilesActiveThisTurn
  } = useTypedSelector(state => state.game);
  const origin = useTypedSelector(state => state.board.originHexCode);
  const originCode = useTypedSelector(state =>
    origin ? state.board.tiles[origin] : 0
  );
  const focus = useFocus();

  const { id: playerId } = useTypedSelector(state => state.profile);

  const center = layout
    ? layout.hexToPixel(new Hex(hexCode))
    : {
        x: 60,
        y: 60
      };

  const hex = new Hex(hexCode);
  const pieceType: null | PieceType =
    propPiece == null ? (Tile.GetPieceType(tileCode) as PieceType) : propPiece;
  const treeType: null | TreeType =
    propTree == null ? (Tile.GetTreeType(tileCode) as TreeType) : propTree;
  const shadowHeight: number = Tile.GetShadowHeight(tileCode);
  const pieceHeight = Tile.GetPieceHeight(tileCode);
  const sky =
    Math.abs(hex.q) == 4 || Math.abs(hex.r) == 4 || Math.abs(hex.s) == 4;
  const shaded =
    !sky &&
    shadowHeight > 0 &&
    shadowHeight >= pieceHeight &&
    focus.shouldShadow(hexCode);

  let sun: boolean = false;

  switch (sunPosition) {
    case SunPosition.NorthWest:
      sun = hex.s != 0 && hex.r != 0 && (hex.r == -4 || hex.s == 4);
      break;
    case SunPosition.NorthEast:
      sun = (hex.q != 0 && hex.r != 0 && hex.q == 4) || hex.r == -4;
      break;
    case SunPosition.East:
      sun = (hex.q != 0 && hex.s != 0 && hex.q == 4) || hex.s == -4;
      break;
    case SunPosition.SouthEast:
      sun = (hex.s != 0 && hex.r != 0 && hex.r == 4) || hex.s == -4;
      break;
    case SunPosition.SouthWest:
      sun = (hex.q != 0 && hex.r != 0 && hex.q == -4) || hex.r == 4;
      break;
    case SunPosition.West:
      sun = (hex.q != 0 && hex.s != 0 && hex.q == -4) || hex.s == 4;
      break;
  }

  const isSelected = (): boolean => {
    if (status == GameStatus.InProgress) {
      if (hexCode && hexCode == origin) return true;
    }
    return false;
  };

  const selected = isSelected();

  const classes = useStyles(props);

  const handleClick = () => {
    if (onClick && !sky) onClick(hexCode);
  };

  let backgroundColor: string;
  let strokeColor: string = "#010";
  if (sky) {
    backgroundColor = "rgba(114,206,224,0.5)";
  } else if (pieceType != null && treeType != null) {
    if (outline) {
      backgroundColor = "#fff";
      strokeColor = treeColor(treeType);
    } else {
      backgroundColor = treeColor(treeType);
    }
  } else {
    backgroundColor = "#bec6b9";
  }

  const treeIcon: string | null = sky
    ? null
    : treeType != null && pieceType != null
    ? TreeSVG(treeType, pieceType)
    : null;

  const emptyLeaves = () => {
    switch (Hex.Distance(hex, new Hex(0))) {
      case 0:
        return EmptyFourLeaf;
      case 1:
        return EmptyThreeLeaf;
      case 2:
        return EmptyTwoLeaf;
      case 3:
        return EmptyOneLeaf;
    }
  };

  const sunIcon: string | null = sky && sun ? Sun : null;

  function handleMouseEnter(): void {
    if (onMouseEnter) onMouseEnter(hexCode);
  }

  function handleMouseLeave(): void {
    if (onMouseLeave) onMouseLeave(hexCode);
  }

  const size = layout?.size.x || 60;
  const sunSize = (size * 2) / 1.18;
  const borderPercent = 0.33;

  const rotateAngle =
    hex.q < 0
      ? hex.r <= 0
        ? hex.s >= 0
          ? 270
          : 0
        : hex.s > 0
        ? 200
        : 150
      : hex.r > 0
      ? hex.s > 0
        ? 10
        : 90
      : hex.s > 0
      ? 330
      : 30;

  const treeScale = pieceHeight == 0 ?
                    0.6 :
                    pieceHeight == 1 ?
                    0.65 :
                    pieceHeight == 2 ?
                    0.8 :
                    pieceHeight == 3 ?
                    1.0 : 0;
  console.log(treeScale);

  return (
    <g>
      <circle onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
              cx={center.x}
              cy={center.y}
              r={(
                  size / sizeFactor)}
              fill={new Color(backgroundColor)
                  .alpha(0)
                  .toString()}
              strokeWidth={Hex.IsSky(hexCode)
                           ? 0
                           : 2}
              stroke={strokeColor} />


      <circle
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        cx={center.x}
        cy={center.y}
        r={(size / sizeFactor) * treeScale}
        fill={new Color(backgroundColor)
          .alpha(treeIcon ? 1 : 0)
          .toString()}
        strokeWidth={Hex.IsSky(hexCode) ? 0 : 0}
        stroke={strokeColor}
      />

      {Hex.IsSky(hexCode) ? (
        ""
      ) : (
        <image
          pointerEvents={"none"}
          href={emptyLeaves()}
          x={center.x - size / 1.2 / 2}
          y={center.y - size / 1.2 / 2}
          width={size / 1.2}
          transform={`rotate(${rotateAngle}, ${center.x},${center.y})`}
          height={size / 1.2}
        />
      )}
      {treeIcon ? (
        <circle
          pointerEvents={"none"}
          cx={center.x}
          cy={center.y}
          r={size * (1 - borderPercent) * treeScale}
          fill={Color(backgroundColor)
            .lighten(1.8)
            .toString()}
          strokeWidth={"0"}
        />
      ) : (
        ""
      )}
      {sunIcon ? (
        <image
          pointerEvents={"none"}
          href={sunIcon}
          x={center.x - sunSize / 2}
          y={center.y - sunSize / 2}
          width={sunSize}
          height={sunSize}
        />
      ) : (
        ""
      )}
      {shaded ? (
        <>
          <circle
            pointerEvents={"none"}
            cx={center.x}
            cy={center.y}
            r={(size / (treeIcon ? 1.5 : 1.2))}
            fill={`rgba(0,25,0,${treeIcon ? 0.5 : 0.2})`}
            strokeWidth={"0.2"}
            stroke={"#000"}
          />
        </>
      ) : (
        ""
      )}
      {treeIcon ? (
        <>
          <image
            pointerEvents={"none"}
            href={treeIcon}
            x={center.x - size / 2}
            y={center.y - size / 2}
            width={size}
            height={size}
            filter={"url(#shadow)"}
          />
        </>
      ) : (
        ""
      )}

      {selected ? (
        <circle
          cx={center.x}
          cy={center.y}
          r={size / 1.2}
          fill={"rgba(0,0,0,0)"}
          strokeWidth={"5"}
          stroke={"#FF0"}
          pointerEvents={"none"}
        />
      ) : (
        ""
      )}
      {focus.on && focus.isFocused(hexCode) ? (
        <circle
          cx={center.x}
          cy={center.y}
          r={size / 1.2}
          fill={"rgba(0,0,0,0)"}
          strokeWidth={"4"}
          stroke={"#ab3"}
          pointerEvents={"none"}
        />
      ) : (
        ""
      )}

      {/*<text x={center.x - size/2} y={center.y-size/4} fontSize={'2em'} stroke="#000" strokeWidth="1px" dy="1em"> {hex.toString()} </text>*/}
    </g>
  );
};

const useStyles = makeStyles({
  root: {
    width: (props: IBoardTileProps) => props.layout?.size.x || 140,
    height: (props: IBoardTileProps) => props.layout?.size.y || 140
  }
});

export default BoardTile;
