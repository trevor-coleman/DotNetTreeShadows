import React, {FunctionComponent} from 'react';
import {useDispatch} from 'react-redux';
import {makeStyles, Theme} from '@material-ui/core/styles';
import {Paper} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import TurnActionButtons from "./TurnActionButtons";
import LightDisplay from "./LightDisplay";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";


interface BottomBarProps {
}

//COMPONENT
const BottomBar: FunctionComponent<BottomBarProps> = (props: BottomBarProps) => {
    const {} = props;
    const classes = useStyles();
    const dispatch = useDispatch();

    return (
        <Paper className={classes.root}>
            <Box p={3}>
                <Grid container spacing={2}>
                    <Grid item xs={6}><LightDisplay/></Grid>
                    <Grid item><Divider orientation="vertical" flexItem style={{height:'100%'}} /></Grid>
                <Grid item xs={5}><TurnActionButtons/></Grid>

                </Grid>

            </Box>
        </Paper>);
};

const useStyles = makeStyles((theme:Theme)=>({
    root: {height:200, width:"100%"}
}));

export default BottomBar;
