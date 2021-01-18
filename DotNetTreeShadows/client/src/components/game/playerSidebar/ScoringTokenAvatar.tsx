import React, { FunctionComponent, useState } from "react";
import { useDispatch } from "react-redux";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { tileColor } from "../../helpers/treeColor";
import { Avatar } from "@material-ui/core";

interface ScoringTokenAvatarProps {
  token?: { leaves: number; points: number };
  hideScores?: boolean;
  light?: boolean;
  score?: number;
  size ?: number;
}

//COMPONENT
const ScoringTokenAvatar: FunctionComponent<ScoringTokenAvatarProps> = (
  props: ScoringTokenAvatarProps
) => {
  const { token, light, score } = props;
  const hideScores = props.hideScores ?? false;
  const classes = useStyles(props);
  const dispatch = useDispatch();

  const points = light ? score : token?.points ?? 0;

  return (
    <Avatar
      className={classes.root}
    >
      {!hideScores ? `${points}` : " "}
    </Avatar>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: ({size}: ScoringTokenAvatarProps) => size ? size : undefined,
    height: ({size}: ScoringTokenAvatarProps) => size ? size : undefined,
    backgroundColor: ({ token, light, score }: ScoringTokenAvatarProps) =>
      light ? score??0 > 0 ? "#edb000" : "#72CEE0" : tileColor(4 - (token?.leaves ?? 0)),
    color: ({ token, light, score }: ScoringTokenAvatarProps) =>
      light
      ? theme.palette.getContrastText(score ?? 0 > 0
                                      ? "#edb000"
                                      : "#72CEE0")
      : "#fff",
    cursor: "default"
  }
}));

export default ScoringTokenAvatar;
