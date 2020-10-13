import React, {FunctionComponent} from 'react';
import {useDispatch} from 'react-redux';
import {makeStyles, Theme} from '@material-ui/core/styles';
import {useTypedSelector} from "../../../store";
import game from "../../../store/game/types/game";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import Button from "@material-ui/core/Button";
import {Paper} from "@material-ui/core";
import {gameOptionDescriptions} from "./HostOptions";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import CheckIcon from '@material-ui/icons/Check';
import NotInterestedIcon from '@material-ui/icons/NotInterested';

interface GameInfoProps {
}

//COMPONENT
const GameInfo: FunctionComponent<GameInfoProps> = (props: GameInfoProps) => {
    const {} = props;
    const classes = useStyles();
    const dispatch = useDispatch();
    const {gameOptions} = useTypedSelector(state => state.game)
    const {name: sessionName} = useTypedSelector(state => state.session)


    return (
        <Paper>
            <Box p={2}>
                <Typography variant={"h6"}>{sessionName}</Typography>
                <Divider/>
                <List>
                    {gameOptionDescriptions.map(({id, description, name}) => (
                        <ListItem disabled={!(gameOptions[id] == true)} key={id}>
                            <ListItemAvatar>{
                                gameOptions[id]
                                    ? <CheckIcon color={"primary"}/>
                                    : <NotInterestedIcon/>}
                            </ListItemAvatar>
                            <ListItemText primary={name} secondary={description}/>
                        </ListItem>))}
                </List>
                <Button color={"secondary"} variant={"contained"}>Start Game</Button>

            </Box>
        </Paper>);
};

const useStyles = makeStyles((theme: Theme) => ({
    root: {}
}));

export default GameInfo;
