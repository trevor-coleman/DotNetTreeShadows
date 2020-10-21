import React, {FunctionComponent, useState} from 'react';
import {useDispatch} from 'react-redux';
import {makeStyles, Theme} from '@material-ui/core/styles';
import {ListItem, Paper} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import {useTypedSelector} from "../../../store";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Checkbox from "@material-ui/core/Checkbox";
import Tooltip from "@material-ui/core/Tooltip";
import withStyles from "@material-ui/core/styles/withStyles";
import Button from "@material-ui/core/Button";
import {setGameOption} from "../../../store/signalR/actions";
import {GameOption} from "../../../store/game/types/GameOption";
import ActionFactory from "../../../gamehub/gameActions/ActionFactory";
import gameActions from "../../../gamehub/gameActions";
import {GameStatus} from "../../../store/game/types/GameStatus";


interface GameStatusProps {
}

//COMPONENT
const HostOptions: FunctionComponent<GameStatusProps> = (props: GameStatusProps) => {
    const {} = props;
    const classes = useStyles();
    const dispatch = useDispatch();
    const [checked, setChecked] = React.useState<string[]>(["AssignTurnOrder"]);
    const {name: sessionName, id:sessionId, host} = useTypedSelector(state => state.session);
    const {id:playerId}= useTypedSelector(state => state.profile);
    const {gameOptions, status, turnOrder}= useTypedSelector(state => state.game);

    const readyToStart = turnOrder.length >= 2;
    console.log(turnOrder, readyToStart);

    const LightTooltip = withStyles((theme: Theme) => ({
        tooltip: {
            backgroundColor: theme.palette.common.white,
            color: 'rgba(0, 0, 0, 0.87)',
            boxShadow: theme.shadows[1],
            fontSize: 13,
        },
    }))(Tooltip);

    const handleStartGame = async () => {
        await gameActions.startGame();
    }

    const GameOptionItem = ({id,name,description}: {
        id: string,
        name: string,
        description: string
    }) => {

        const optionState = gameOptions[id] ?? false;

        function handleCheck(gameOption: string, value:boolean) {
            dispatch(setGameOption(gameOption as GameOption, value, sessionId));
        }

        return (
            <LightTooltip title={description} aria-label={`${id}-tooltip`} placement={"right-end"}><ListItem dense onClick={()=>handleCheck(id, !optionState)}>
                <ListItemIcon>
                    <Checkbox
                        edge="start"
                        checked={optionState}
                        tabIndex={-1}
                        disableRipple
                        inputProps={{'aria-labelledby': `checkbox-list-${id}`}}
                    />
                </ListItemIcon>
                <ListItemText primary={name}/>
            </ListItem></LightTooltip>
        );
    }


    return (
        <Paper>
            <Box p={2}>
                <Typography variant={"subtitle1"}>{GameStatus[status]}</Typography>
                <Divider/>
                <List>
                    {gameOptionDescriptions.map(option=><GameOptionItem key={option.id} {...option}/>)}
                </List>
                <Box m={1} className={classes.startGameButtonContainer}>
                    <Button className={classes.startGameButton} disabled={!readyToStart} color={"secondary"} variant={"contained"} onClick={handleStartGame}>
                        Start Game
                    </Button>
                </Box>
            </Box>
        </Paper>);
};

const useStyles = makeStyles((theme: Theme) => ({
    root: {},
    startGameButton: {align:"right"},
    startGameButtonContainer: {display:"flex", justifyContent:"center"}
}));

export default HostOptions;

export const gameOptionDescriptions = [
    {
        id: "LongGame",
        name: "Long Game",
        description: "Play 4 revolutions instead of 3"
    }, {
        id: "PreventActionsInShadow",
        name: "Prevent Actions In Shadow",
        description: "Disallows plant and grow in shadow"
    }
]
