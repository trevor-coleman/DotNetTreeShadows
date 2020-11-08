import React from "react";
import Tile from "../../../store/board/types/tile";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { Hex } from "../../../store/board/types/Hex";
import { HexLayout } from "../../../store/board/types/HexLayout";
import { SunPosition } from "../../../store/game/types/sunPosition";
import { useTile } from "../../../store/board/reducer";
import { useSunPosition } from "../../../store/game/reducer";
import { usePlayerBoard } from "../../../store/playerBoard/reducer";

interface ITileShadowProps {
  hexCode: number;
  layout: HexLayout;
  sizeFactor?: number;
}

const TileShadow = (props: ITileShadowProps) => {
  const { layout, hexCode } = props;

  usePlayerBoard();

  const tileCode = useTile(hexCode);
  const pieceHeight = Tile.GetPieceHeight(tileCode);
  const sunPosition: SunPosition = useSunPosition();

  const treeScale =
    pieceHeight == 0
      ? 0.6
      : pieceHeight == 1
      ? 0.65
      : pieceHeight == 2
      ? 0.8
      : pieceHeight == 3
      ? 1.0
      : 0;

  const center = layout
    ? layout.hexToPixel(new Hex(hexCode))
    : {
        x: 60,
        y: 60
      };

  const size = layout?.size.x || 60;

  let shadeAngle;
  switch (sunPosition) {
    case SunPosition.NorthWest:
      shadeAngle = -30;
      break;
    case SunPosition.NorthEast:
      shadeAngle = 30;
      break;
    case SunPosition.East:
      shadeAngle = 90;
      break;
    case SunPosition.SouthEast:
      shadeAngle = 150;
      break;
    case SunPosition.SouthWest:
      shadeAngle = -150;
      break;
    case SunPosition.West:
      shadeAngle = -90;
      break;
  }

  const width = (treeScale * (size * 2)) / 1.2;

  const height: number = (size / 1.18) * (pieceHeight * 2 + 2) - (size - size*treeScale);

  return (
    <g>
      {pieceHeight > 0 ? (
        <rect
          x={center.x - (treeScale * size) / 1.2}
          y={center.y - (treeScale * size) / 1.2}
          rx={pieceHeight == 1
              ? 80
              : 100}
          ry={pieceHeight == 1 ? 80: 100}
          width={width}
          height={height}
          fill={"rgba(0,25,0,0.4)"}
          transform={`rotate(${shadeAngle},${center.x}, ${center.y})`}
          style={{ pointerEvents: "none" }}
        />
      ) : null}
    </g>
  );
};

makeStyles({
  root: {
    width: (props: ITileShadowProps) => props.layout?.size.x || 140,
    height: (props: ITileShadowProps) => props.layout?.size.y || 140
  }
});

export default TileShadow;
