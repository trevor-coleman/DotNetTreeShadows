import React, {FunctionComponent} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../store/store';
import {makeStyles} from '@material-ui/core/styles';
import DebugToolbar from "./DebugToolbar";
import GameBoard from "./game/GameBoard";

interface INewApiTestProps {
}

//COMPONENT
const NewApiTest: FunctionComponent<INewApiTestProps> = (props: INewApiTestProps) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const {signedIn} = useSelector((state: RootState) => state.auth)
    const {id, name, email} = useSelector((state: RootState) => state.profile)

    return <div><DebugToolbar/>
        <GameBoard/></div>
};

const useStyles = makeStyles({
    root: {
        padding: "2em",
        marginTop: '2em'
    }
});

export default NewApiTest;
