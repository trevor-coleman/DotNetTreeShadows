import React, {FunctionComponent} from 'react';
import {useDispatch} from 'react-redux';
import {makeStyles, Theme} from '@material-ui/core/styles';
import SignInForm from "../SignInForm";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import RegisterForm from "../RegisterForm";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import {useHistory, useLocation, Redirect} from "react-router-dom";
import {LocationState} from "../../routes/LocationState";
import {useTypedSelector} from "../../store";
import { Rules } from '../Rules';

interface PublicPageProps {
}

//COMPONENT
const SignIn: FunctionComponent<PublicPageProps> = (props: PublicPageProps) => {
    const {} = props;
    const classes = useStyles();
    const dispatch = useDispatch();
    const {signedIn} = useTypedSelector(state => state.auth)
    const history = useHistory();
    const location = useLocation<LocationState>();
    const {from} = location.state || {from: {pathname: "/"}};


    if(signedIn) return <Redirect
        to={{
            pathname: "/",
            state: { from: location }
        }}
    />

    return (
        <Container maxWidth={false} className={classes.root}><Box m={3}>
            <Grid container direction={"column"} spacing={5}>
            <Grid item container>
                <Grid item xs={2}/>
                <Grid item xs={8}>
                    <Paper><Box p={2}><Typography variant={"h2"} align={"center"}>Tree Shadows</Typography></Box></Paper>
                </Grid>
                <Grid item xs={2}/>
            </Grid>
            <Grid item container spacing={3}>
                <Grid item xs={6}><SignInForm/></Grid>
                <Grid item xs={6}><RegisterForm/></Grid>
            </Grid></Grid>
        </Box></Container>);
};

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        backgroundColor:"#7e9278",
        height:"100vh",
        overflow:"hidden",
    }
}));

export default SignIn;
