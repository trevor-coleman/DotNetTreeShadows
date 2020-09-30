import React from 'react';
import { TreeType, PieceType, Tile } from '../store/sessions/types';
import TreeSVG from '../svg/TreeSVG';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Sun from '../svg/sun-svgrepo-com.svg';
import { Point } from '../models/hex-grid/Point';

interface BoardTileProps {
  onClick?: (tile:Tile)=>void,
  onMouseEnter?: (tile:Tile)=>void,
  onMouseLeave?:(tile:Tile)=>void,
  size: number
  tile: Tile
  center: Point,
}

const BoardTile = (props: BoardTileProps) => {

  const {tile, onClick, onMouseEnter, onMouseLeave, size, center} = props;

  const {pieceType, treeType} = tile;
  const shaded = tile.shadowHeight > 0;
  const sky = Math.abs(tile.hexCoordinates.q) ==4 || Math.abs(tile.hexCoordinates.r) ==4 || Math.abs(tile.hexCoordinates.s) == 4;
  const sun = false;

  const classes = useStyles(props);

  const treeColors : {[treeType:string] : string} = {
    Aspen: "#703510",
    Poplar: "#19572b",
    Ash: "#1c415a",
    Birch: "#6d4c0a"
  }

  const handleClick= () => {
    if(onClick) onClick(tile);
  }

  let backgroundColor: string;
  if (sky) {
    backgroundColor = "#72CEE0";
  }
  else if(pieceType && treeType) {
    backgroundColor = treeColors[treeType]
  }
  else {
    backgroundColor = "#acbeac";
  }

  const treeIcon: string | null = sky
                                  ? null
                                  : treeType && pieceType
                                    ? TreeSVG(treeType, pieceType)
                                    : null;


  const sunIcon: string | null = sky && sun
                                 ? Sun
                                 : null;

  function handleMouseEnter(): void {
    if(onMouseEnter) onMouseEnter(tile);
  }
  function handleMouseLeave(): void {
    if(onMouseLeave) onMouseLeave(tile);
  }

  return (<g>
        <circle onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={handleClick} cx={center.x} cy={center.y} r={size/1.2} fill={backgroundColor} strokeWidth={2} stroke={"#010"} />
        {sunIcon
         ? <image href={sunIcon} x={center.x - size/2} y={center.y-size/2} width={size} height={size} />
         : ''}
        {treeIcon
         ? <image href={treeIcon} x={center.x-size/2} y={center.y-size/2} width={size} height={size} />
         : ''}
        {shaded
         ? <circle cx={500} cy={500} r={450} fill={"rgba(0,0,0,0.3)"} strokeWidth={"0.2"} stroke={"#000"} />
         : ''}
      </g>)
};

const useStyles = makeStyles({
  root: {
    width: (props: BoardTileProps) => props.size,
    height: (props: BoardTileProps) => props.size,
  },
});

export default BoardTile;
