import React from 'react';
import {TreeType} from "../../store/board/types/treeType";
import {PieceType} from "../../store/board/types/pieceType";

import TreeSVG from '../../svg/TreeSVG';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Sun from '../../svg/sun-svgrepo-com.svg';
import Tile from "../../store/board/types/tile";

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
  onClick?: (hexCode: number)=>void,
  size: number
  tileCode: number
  hexCode: number
}

const SVGTreeToken = (props: SVGTreeTokenProps) => {

  const {tileCode, hexCode, onClick} = props;

  const {pieceType, treeType, shadowHeight, isSky} = Tile.Details(tileCode);

  const shaded = shadowHeight > 0;
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
  if (isSky) {
    backgroundColor = "#72CEE0";
  }
    else if(pieceType && treeType) {
      backgroundColor = treeColors[treeType]
  }
  else {
    backgroundColor = "#acbeac";
  }

  const treeIcon: string | null = isSky
                                  ? null
                                  : treeType && pieceType
                                    ? TreeSVG(treeType, pieceType)
                                    : null;

  console.log(treeIcon);

  const sunIcon: string | null = isSky && sun
                                 ? Sun
                                 : null;

  function handleClick() {
    if(onClick) onClick(hexCode);
  }

  return <div className={classes.root} onClick={handleClick}>
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
