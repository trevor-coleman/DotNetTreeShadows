import React, {FunctionComponent} from 'react';
import {useDispatch} from 'react-redux';
import {makeStyles, Theme} from '@material-ui/core/styles';
import {useTypedSelector} from "../../../store";
import {Box} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import Grid from "@material-ui/core/Grid";
import {useLight, usePlayerBoard} from "../../../store/playerBoard/reducer";
import {usePlayerId} from "../../../store/profile/reducer";


interface LightDisplayProps {
}

//COMPONENT
const LightDisplay: FunctionComponent<LightDisplayProps> = (props: LightDisplayProps) => {
    const classes = useStyles();
    const id = usePlayerId();
    const light = useLight();

    const numberOfRows = 3;

    const lightArray: { filled: boolean, key: string }[] = []

    for (let i = 0; i < 30; i++) {
        lightArray.push({
            filled: i < light,
            key: `${id}-light-${i}`,
        });
    }

    return (<Box className={classes.root}>
            <Typography variant={'subtitle1'} className={classes.title}>Light - {light}</Typography>
        <Grid container spacing={1} >
            {lightArray.map(
                ({filled,key}, index) => (
                            <Grid item key={key}><LightIcon filled={filled} index={index}/></Grid>)
                        )}
        </Grid></Box>
    )
};

type LightIconProps = {
    filled: boolean,
    index: number,

}
const LightIcon = (props: LightIconProps) => {
    const classes = useStyles();
    return (<div className={classes.wrapper}><Avatar className={props.filled ? classes.filled:classes.empty}>{props.index + 1}</Avatar></div>);
}

const useStyles = makeStyles( (theme:Theme)=>
({
    root: {
        width: "100%",
        marginBottom: 16
    },
    title: {
        marginBottom: theme.spacing(1),
    },
    filled: {
        width: 24,
        height: 24,
        backgroundColor: '#edb000',
        color: theme.palette.getContrastText('#edb000'),
    },
    empty: {
        width: 24,
        height: 24,
        backgroundColor: '#72CEE0',
        color: theme.palette.getContrastText('#72CEE0'),


    },

    wrapper: {
        display: 'inline-block'
    },
    lightIcon: {
        width: 30,
        height: 30,
    }

}));

export default LightDisplay;
