import React, {FunctionComponent} from 'react';
import {useDispatch} from 'react-redux';
import {makeStyles, Theme} from '@material-ui/core/styles';
import {Avatar} from "@material-ui/core";
import SvgIcon from "@material-ui/core/SvgIcon";
import {TreeType} from "../../../store/board/types/treeType";
import {PieceType} from "../../../store/board/types/pieceType";
import TreeSVG from "../../../svg/TreeSVG";
import treeColor from "../../helpers/treeColor";
import Color from "color";

interface TreeAvatarIconProps {
  treeType: TreeType,
  pieceType?: PieceType,
  text?: string,
  active?: boolean,
  gridHeader?: boolean,
  empty?: boolean,
  connected?: boolean,
  size?: number,
  fontSize?: "inherit" | "default" | "large" | "small" | undefined,
  highlight?: boolean,

}

interface styleProps extends TreeAvatarIconProps {
  color: string,
}

//COMPONENT
const TreeAvatarIcon: FunctionComponent<TreeAvatarIconProps> = (props: TreeAvatarIconProps) => {
  const {treeType, text, gridHeader, empty, size: propSize} = props;
  const pieceType = props.pieceType ?? PieceType.MediumTree;
  const active = props.active ?? true;
  const highlight = props.highlight ?? false;

  let connected = props.connected ?? false;


  let size = 48//propSize ?? 24;
  let center = size / 2;
  let scale: number;


  switch (pieceType) {
    case PieceType.Seed:
      scale = 1;
      break;
    case PieceType.SmallTree:
      scale = 1;
      break;
    case PieceType.MediumTree:
      scale = 1;
      break;
    case PieceType.LargeTree:
      scale = 0.75;
      break;

  }

  const scaledSize:number = size * scale;

  const color = treeColor(treeType, active ? 1 : 0.2);

  let styleProps = {
    ...props,
    connected,
    color
  };

  const classes = useStyles(styleProps);

  useDispatch();

  const svgTree = TreeSVG(treeType, pieceType)


  const borderString =
    gridHeader
      ? `2px outset ${color}`
      : empty
      ? "1px dashed grey"
      : highlight
        ? "3px solid " + "#61e30a"
        : connected == true
          ? "3px solid green"
          : `3px solid ${color}`


  return (
    <Avatar style={{border: borderString}} className={classes.avatar}>
      {text || empty
        ? text
        : <SvgIcon fontSize={props.fontSize ?? "large"}>
          <svg className={classes.svg} xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${size} ${size}`}>
            {gridHeader ? "" :
              <circle cx={center} cy={center} r={size / 2} fill={Color(color).lighten(2).toString()}/>}
              <image href={svgTree} x={center - (scaledSize * 0.5)} y={center - (scaledSize * 0.5)}
                     width={scaledSize} height={scaledSize}/>
          </svg>
        </SvgIcon>}
    </Avatar>);
};

const useStyles = makeStyles((theme: Theme) => ({
  svg: {
    pointerEvents: "none"
  },

  avatar: {
    backgroundColor: ({color, empty, gridHeader}: styleProps) => empty || gridHeader ? "#fff" : color,
    color: ({color, empty}: styleProps) => empty ? "grey" : theme.palette.getContrastText(color),
    width: ({size}: styleProps) => size,
    height: ({size}: styleProps) => size,
    cursor: "default",
  },
}));

export default TreeAvatarIcon;

