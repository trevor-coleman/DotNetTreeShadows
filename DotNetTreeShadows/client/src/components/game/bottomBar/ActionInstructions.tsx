import React, {FunctionComponent} from 'react';
import {useDispatch} from 'react-redux';
import {makeStyles, Theme} from '@material-ui/core/styles';
import { clearCurrentAction } from '../../../store/game/reducer';
import {Typography} from "@material-ui/core";
import {useTypedSelector} from "../../../store";
import {GameActionType} from "../../../store/game/actions";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";


interface ActionInstructionsProps {
}

//COMPONENT
const ActionInstructions: FunctionComponent<ActionInstructionsProps> = (props: ActionInstructionsProps) => {
    const {} = props;
    const classes = useStyles();
    const dispatch = useDispatch();
    const {currentAction} = useTypedSelector(state => state.game)
    const actionType = currentAction.type;
    console.log(actionType)

    const handleCancel = ()=>{dispatch(clearCurrentAction())}

    const actionInstruction = "Select a tile to place your first tree."

    return (
            <Grid container spacing={2}>
                <Grid item><Typography variant={'subtitle1'}>Instruction</Typography></Grid>
                <Grid container item className={classes.container}  direction={"column"} xs={12}>
                <Grid item className={classes.instruction}>
                    <Typography variant={"h6"} paragraph>{actionInstruction}</Typography>
                </Grid>
                <Grid item container className={classes.cancelButton}>
                    <Grid item className={classes.buttonSpacer}/>
                    <Grid item>
                    <Button onClick={handleCancel} variant={"contained"}>Cancel</Button>
                    </Grid>
                </Grid>
                </Grid>
            </Grid>
        );
};

const useStyles = makeStyles((theme: Theme) => ({
    root: {},
    container: {
        flexGrow:1,
        width:"100%"
    },
    instruction: {
        flexGrow:1
    }, cancelButton: {
        alignItems: "flex-end",
        justifyContent: "flex-end",
    }, buttonSpacer: {
        flexGrow:1
    }
}));

export default ActionInstructions;
