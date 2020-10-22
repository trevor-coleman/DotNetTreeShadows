import React, {FunctionComponent} from 'react';
import {useDispatch} from 'react-redux';
import {makeStyles, Theme} from '@material-ui/core/styles';
import {Avatar} from "@material-ui/core";
import SvgIcon from "@material-ui/core/SvgIcon";
import SunIcon from '../../../svg/sun-svgrepo-com.svg';
import Color from "color";

interface YearAvatarIconProps {
  sun?: boolean;
  size?: number

}

interface styleProps extends YearAvatarIconProps {
  color: string,
  size: number,
}

//COMPONENT
const YearAvatarIcon: FunctionComponent<YearAvatarIconProps> = (props: YearAvatarIconProps) => {

  const sun = props.sun ?? false;

  let size = props.size ?? 48;
  let center = size / 2;
  let scale = 1;

  const scaledSize: number = size * scale;

  const color = "#72CEE0"

  let styleProps = {
    ...props,
    size,
    color
  };

  const classes = useStyles(styleProps);

  useDispatch();


  return (
    <Avatar className={classes.avatar}>
      <SvgIcon>
        <svg className={classes.svg} xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${size} ${size}`}>
          <circle cx={center} cy={center} r={size / 2} fill={color}/>
          {sun ? <image
              href={SunIcon}
              x={center - (scaledSize * 0.5)}
              y={center - (scaledSize * 0.5)}
              width={scaledSize}
              height={scaledSize}/>

            : ""}
        </svg>

      </SvgIcon>
    </Avatar>);
};

const useStyles = makeStyles((theme: Theme) => ({
  svg: {
    pointerEvents: "none"
  },

  avatar: {
    backgroundColor: ({color}: styleProps) => color,
    color: ({color}: styleProps) => theme.palette.getContrastText(color),
    width: ({size}: styleProps) => size,
    height: ({size}: styleProps) => size,
    cursor: "default",
  },
}));

export default YearAvatarIcon;

