import React, {FunctionComponent} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import {useTypedSelector} from "../../store";
import PlayerBoard from "../../store/game/types/playerBoard";
import {Box} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";


interface LightDisplayProps {
}

//COMPONENT
const LightDisplay: FunctionComponent<LightDisplayProps> = (props: LightDisplayProps) => {
    const {} = props;
    const classes = useStyles();
    const dispatch = useDispatch();
    const {id} = useTypedSelector(state => state.profile);
    const boardCode: number = useTypedSelector(state => state.game.playerBoards[id]);
    const light = PlayerBoard.GetLight(boardCode);

    return (
        <Box className={classes.root}>
            <Typography>Light</Typography>
            <Typography align={"center"}>{`${light} / 30`}</Typography>
        </Box>
    )
};

const useStyles = makeStyles({
    root: {
        width: 260,
        marginBottom: 16
    },

});

export default LightDisplay;
