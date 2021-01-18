import React, { FunctionComponent } from "react";
import { useDispatch } from "react-redux";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { useTreeType } from "../../../store/playerBoard/reducer";

import GrowingPrices from "./ActionInformation/GrowingPrices"
import { useTypedSelector } from '../../../store';
import { GameActionType } from '../../../store/game/actions';
import PriceInformation from './ActionInformation/PriceInformation';

interface ActionInformationProps {}

//COMPONENT
const ActionInformation: FunctionComponent<ActionInformationProps> = (
  props: ActionInformationProps
) => {
  const {} = props;
  const classes = useStyles();
  const currentActionType = useTypedSelector(state => state.game.currentActionType);

  return <div>
    {currentActionType == GameActionType.Grow ? <GrowingPrices /> : <div/>}
    {currentActionType == GameActionType.Collect ? <PriceInformation price={4} /> : ""}
    {currentActionType == GameActionType.Plant ? <PriceInformation price={1} /> : ""}

  </div>;
};

const useStyles = makeStyles((theme: Theme) => ({}));

export default ActionInformation;
