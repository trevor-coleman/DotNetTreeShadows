import React, { FunctionComponent } from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { TreeType } from '../../../../store/board/types/treeType';
import { PieceType } from '../../../../store/board/types/pieceType';
import Grid from '@material-ui/core/Grid';
import { SvgIcon, Avatar } from '@material-ui/core';
import Color from 'color';
import treeColor from '../../../helpers/treeColor';
import TreeSVG from '../../../../svg/TreeSVG';
import { useTreeType } from '../../../../store/playerBoard/reducer';

interface TreePriceIconProps {
  pieceType: PieceType;
}



//COMPONENT
const TreePriceIcon: FunctionComponent<TreePriceIconProps> = (props: TreePriceIconProps) => {
  const {pieceType} = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const treeType = useTreeType();



  let size = 48//propSize ?? 24;
  let center = size / 2;
  const color: string = treeColor(treeType,
      0.2);
  const borderString = `3px solid ${color}`

  let scale = 1;

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

  const scaledSize: number = size * scale;

  const svgTree = TreeSVG(treeType, pieceType)

  return (
      <Grid item container className={classes.treePriceIcon} xs={1}>
        <Grid item>
          <Avatar style={{border: borderString}} className={classes.avatar}><SvgIcon fontSize={"large"}>
            <svg className={classes.svg}
                 xmlns="http://www.w3.org/2000/svg"
                 viewBox={`0 0 ${size} ${size}`}>
              <circle cx={center}
                         cy={center}
                         r={size / 2}
                         fill={Color(color).lighten(2).toString()} />}
              <image href={svgTree}
                     x={center - (
                         scaledSize * 0.5)}
                     y={center - (
                         scaledSize * 0.5)}
                     width={scaledSize}
                     height={scaledSize}
                     filter="url(#avatar-shadow)" />
            </svg>
          </SvgIcon>
          </Avatar>
        </Grid>
      </Grid>);
};

const useStyles = makeStyles((theme: Theme) => (
    {
      root: {},
      avatar:{},
      treePriceIcon: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      },
      svg: {
        pointerEvents: "none"
      },
    }));



export default TreePriceIcon;
