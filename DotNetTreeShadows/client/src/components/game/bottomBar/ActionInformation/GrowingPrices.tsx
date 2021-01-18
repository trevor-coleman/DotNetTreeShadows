import React, { FunctionComponent } from "react";
import { useDispatch } from "react-redux";
import { makeStyles, Theme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import { PieceType } from "../../../../store/board/types/pieceType";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import LightIcon from "../LightIcon";
import { useTreeType } from "../../../../store/playerBoard/reducer";
import TreePriceIcon from "./TreePriceIcon";
import Typography from '@material-ui/core/Typography';

interface GrowingPricesProps {}

//COMPONENT
const GrowingPrices: FunctionComponent<GrowingPricesProps> = (
  props: GrowingPricesProps
) => {
  const {} = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const treeType = useTreeType();

  const PriceArrows = (props: { price: number }) => (
    <Grid item container direction={"column"} className={classes.lightIcon}>
      <Grid item container alignItems={"center"}>
        <ArrowForwardIcon fontSize="small" color={"disabled"} />
        <LightIcon index={props.price - 1} semiTransparent filled />
        <ArrowForwardIcon fontSize="small" color={"disabled"} />
      </Grid>
    </Grid>
  );

  return (
      <Grid
      item
      container
      className={classes.growing}
      direction={"row"}
      xs={12}
      spacing={1}
      justify={"center"}
      alignItems={"center"}
      >
        <Typography className={classes.pricesLabel}>{"Prices: "}</Typography>
        <TreePriceIcon pieceType={PieceType.Seed} />
        <PriceArrows price={1} />
        <TreePriceIcon pieceType={PieceType.SmallTree} />
        <PriceArrows price={2} />
        <TreePriceIcon pieceType={PieceType.MediumTree} />
        <PriceArrows price={3} />
        <TreePriceIcon pieceType={PieceType.LargeTree} />
    </Grid>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  label: {
    height: theme.spacing(2)
  },
  pricesLabel: {
    paddingRight: "1em",
  },
  lightIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "fit-content"
  },
  growing: {
    display: "flex",
    flexDirection: "row"
  }
}));

export default GrowingPrices;
