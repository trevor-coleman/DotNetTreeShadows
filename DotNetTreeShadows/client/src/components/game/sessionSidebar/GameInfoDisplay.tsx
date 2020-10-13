import React, {FunctionComponent} from 'react';
import {useDispatch} from 'react-redux';
import {makeStyles, Theme} from '@material-ui/core/styles';


interface GameStatusProps {
}

//COMPONENT
const GameInfoDisplay: FunctionComponent<GameStatusProps> = (props: GameStatusProps) => {
    const {} = props;
    const classes = useStyles();
    const dispatch = useDispatch();

    return (
        <div className={classes.root}>
            GameStatus
        </div>);
};

const useStyles = makeStyles((theme: Theme) => ({
    root: {}
}));

export default GameInfoDisplay;
