import React, {FunctionComponent} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../store';
import {makeStyles} from '@material-ui/core/styles';
import {Paper, Typography} from "@material-ui/core/";
import SignInForm from "./SignInForm";
import {RequestState} from "../api/requestState";
import {fetchProfile} from "../store/profile/reducer";
import DebugToolbar from "./DebugToolbar";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import SessionCreator from "./SessionCreator";

interface INewApiTestProps {
}
//COMPONENT
const NewApiTest: FunctionComponent<INewApiTestProps> = (props: INewApiTestProps) => {
    const classes = useStyles();
    const dispatch=useDispatch();
    const {signedIn} = useSelector((state:RootState)=>state.auth )
    const {loadingProfileState, id, name, email} = useSelector((state:RootState)=> state.profile)
    if(signedIn && loadingProfileState==RequestState.Idle ) {
        dispatch(fetchProfile())
    }

    return <div><DebugToolbar/><Paper className={classes.root}><Typography variant={"h4"}>Here I Am</Typography><SignInForm/></Paper>
    <Paper className={classes.root}>
        <List>
            <ListItem>
                {signedIn ? "Woo": "Nay"}
            </ListItem>
            <ListItem>
                {id.toString() }
            </ListItem>
            <ListItem>
                {name}
            </ListItem>
            <ListItem>
                {email}
            </ListItem>
        </List>
    </Paper><SessionCreator/> </div>;
};

const useStyles = makeStyles({root: {padding:"2em"}});

export default NewApiTest;
