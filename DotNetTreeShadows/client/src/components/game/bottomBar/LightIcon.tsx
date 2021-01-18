import Avatar from "@material-ui/core/Avatar";
import React from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";
import Color from "color";

type LightIconProps = {
  filled?: boolean;
  index: number;
  semiTransparent?: boolean;
};
const LightIcon = (props: LightIconProps) => {
  const classes = useStyles(props);
  return (
    <div className={classes.wrapper}>
      <Avatar className={props.filled ? classes.filled : classes.empty}>
        {props.index + 1}
      </Avatar>
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: "100%",
    marginBottom: 16
  },
  title: {
    marginBottom: theme.spacing(1)
  },
  filled: {
    width: 24,
    height: 24,
    backgroundColor: (props:LightIconProps)=>new Color("#edb000").alpha(props.semiTransparent?0.5:1).toString(),
    color: theme.palette.getContrastText("#edb000")
  },
  empty: {
    width: 24,
    height: 24,
    backgroundColor: (props: LightIconProps) => new Color("#72CEE0").alpha(props.semiTransparent
                                                                           ? 0.5
                                                                           : 1)
                                                                    .toString(),
    color: theme.palette.getContrastText("#72CEE0")
  },

  wrapper: {
    display: "inline-block"
  },
  lightIcon: {
    width: 30,
    height: 30
  }
}));

export default LightIcon;
