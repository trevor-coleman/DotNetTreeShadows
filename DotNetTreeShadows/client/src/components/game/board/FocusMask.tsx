import React, { FunctionComponent } from "react";
import { useDispatch } from "react-redux";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { HexLayout } from "../../../store/board/types/HexLayout";
import { Hex } from '../../../store/board/types/Hex';
import Color from 'color';

interface FocusMaskProps {
  hexCode?: number;
  layout?: HexLayout;
}

//COMPONENT
const FocusMask: FunctionComponent<FocusMaskProps> = (
  props: FocusMaskProps
) => {
  const {layout} = props;
  const classes = useStyles();
  const dispatch = useDispatch();

  const hexCode = (props.hexCode ? props.hexCode : 0) as number;

  const center = layout
                 ? layout.hexToPixel(new Hex(hexCode))
                 : {
        x: 60,
        y: 60
      };

  const size = layout?.size.x || 60;

  return <circle cx={center.x}
                 cy={center.y}
                 r={size/1.2}
                 fill={"#000"}
                 strokeWidth={"0"}
                 pointerEvents={"none"}
                 />
};

const useStyles = makeStyles((theme: Theme) => ({
  root: {}
}));

export default FocusMask;
