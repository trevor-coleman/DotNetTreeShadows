import React from 'react';
import { TreeType, PieceType, Tile } from '../store/sessions/types';
import TreeSVG from '../svg/TreeSVG';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Sun from '../svg/sun-svgrepo-com.svg';

interface GroundTokenInfo {
  tokenType: "Ground"
  treeType: TreeType,
  pieceType: PieceType,
  shaded: boolean,
}

interface SkyTokenInfo {
  tokenType: "Sky"
  sun: boolean
}

export type TokenInfo = GroundTokenInfo | SkyTokenInfo;


interface SVGTreeTokenProps {
  onClick?: ()=>void,
  size: number
  tile: Tile
}

const SVGTreeToken = (props: SVGTreeTokenProps) => {

  const {tile, onClick} = props;

  const {pieceType, treeType} = tile;
  const shaded = tile.shadowHeight > 0;
  const sky = tile.hexCoordinates.q ==4 || tile.hexCoordinates.r ==4 ||tile.hexCoordinates.s == 4;
  const sun = false;

  const classes = useStyles(props);
  console.log(props);

  const treeColors : {[treeType:string] : string} = {
    Aspen: "#703510",
    Poplar: "#19572b",
    Ash: "#1c415a",
    Birch: "#6d4c0a"
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

  console.log(treeIcon);

  const sunIcon: string | null = sky && sun
                                 ? Sun
                                 : null;

  return <div className={classes.root} onClick={onClick}>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 1000 1000`}>
      <g>
        <circle cx={500} cy={500} r={450} fill={backgroundColor} strokeWidth={0} stroke={"#333"} />
        {sunIcon
         ? <image href={sunIcon} x={100} y={100} width={800} height={800} />
         : ''}
        {treeIcon
         ? <image href={treeIcon} x={100} y={100} width={800} height={800} />
         : ''}
        {shaded
         ? <circle cx={500} cy={500} r={450} fill={"rgba(0,0,0,0.3)"} strokeWidth={"0.2"} stroke={"#000"} />
         : ''}
      </g>
    </svg>
  </div>;

};

const useStyles = makeStyles({
  root: {
    width: (props: SVGTreeTokenProps) => props.size,
    height: (props: SVGTreeTokenProps) => props.size,
  },
});

export default SVGTreeToken;
