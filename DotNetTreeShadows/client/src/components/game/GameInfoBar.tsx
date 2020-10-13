import React, {FunctionComponent} from 'react';
import {useDispatch} from 'react-redux';
import {Box, Paper} from "@material-ui/core";
import {useTypedSelector} from "../../store";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Grid from "@material-ui/core/Grid";
import {GameOption} from "../../store/game/types/GameOption";
import Button from "@material-ui/core/Button";

interface GameInfoBarProps {
}

//COMPONENT
const GameInfoBar: FunctionComponent<GameInfoBarProps> = (props: GameInfoBarProps) => {
    const {} = props;
    useStyles();
    useDispatch();
    const {turnOrder, revolution, gameOptions} = useTypedSelector(state => state.game)
    const {host, connectedPlayers} = useTypedSelector(state => state.session);
    const {id: playerId} = useTypedSelector(state => state.profile);

    const showStartGameButton = playerId == host;
    const disableStartGameButton =  connectedPlayers && turnOrder ? connectedPlayers.length != turnOrder.length : true;


    return (
                <Paper >
                    <Box p={2}>
                    <Grid container direction={"column"} spacing={2}>
                        <Grid
                            item>Revolution: {revolution} / {gameOptions[GameOption.LongGame] ? 4 : 3}</Grid>
                        {showStartGameButton ?
                            <Grid item><Button disabled={disableStartGameButton} variant={"contained"}>Start
                                Game</Button></Grid> : ""}
                    </Grid>
                    </Box>
                </Paper>
    );
};

const useStyles = makeStyles({
    root: {},
    playerLabel: {
        height: "2em",
        fontSize: "0.75rem"
    },
    boardTile: {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%,-50%)",
        width: 48,
        height: 48
    },
    turnOrderIcon: {
        position: "relative",
        margin: 8,
        width: 64,
        height: 64,
    },

    turnOrderPiece: {
        display: "block",
        alignItems: 'center',
        border: "1px solid green"
    },
});

export default GameInfoBar;
