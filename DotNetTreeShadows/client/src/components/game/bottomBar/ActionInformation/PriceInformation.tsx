import React, { FunctionComponent } from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles, Theme } from '@material-ui/core/styles';
import LightIcon from '../LightIcon';

interface PriceInformationProps {
  price: number
}

//COMPONENT
const PriceInformation: FunctionComponent<PriceInformationProps> = (props: PriceInformationProps) => {
  const {price} = props;
  const classes = useStyles();
  const dispatch = useDispatch();

  return (
      <div className={classes.root}>
        Price: <LightIcon index={price-1} semiTransparent filled /> </div>);
};

const useStyles = makeStyles((theme: Theme) => (
    {
      root: {},
    }));

export default PriceInformation;
