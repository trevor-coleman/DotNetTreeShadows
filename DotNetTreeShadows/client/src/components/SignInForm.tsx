import React, { FunctionComponent, useState } from 'react';
import {connect, ConnectedProps, useDispatch} from 'react-redux';
import { RootState } from '../store';
import { makeStyles } from '@material-ui/core/styles';
import { Container } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CardContent from '@material-ui/core/CardContent';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import {SignInCredentials} from "../store/auth/signInCredentials";
import {signInAndFetchProfile} from "../store/auth/actions";

interface ISignInFormProps {}

//COMPONENT
const SignInForm: FunctionComponent<ISignInFormProps> = (props: ISignInFormProps) => {
    const classes = useStyles();
    const dispatch= useDispatch();

    const signIn = (credentials:SignInCredentials) => {
        dispatch(signInAndFetchProfile(credentials))
    }


    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return <Card className={classes.SignInForm}>
        <CardContent>
          <Typography variant="h5">Sign In</Typography>
        <form
            noValidate
            autoComplete="off">
            <div><TextField
                required
                id="email"
                label="email"
                type="email"
                autoComplete="email"
                className={classes.TextInput}
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} /></div>
            <div><TextField
                required
                id="password"
                label="password"
                type="password"
                autoComplete="password"
                className={classes.TextInput} value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} /></div>
            <div><Button
                variant="outlined"
                disabled={email.length<3 && password.length < 3}
                color="primary" onClick={()=>signIn({email, password})} >Sign In</Button></div>
        </form>
        </CardContent>
    </Card>;
};

const useStyles = makeStyles({
    SignInForm: {
    },
    TextInput: {
        width: "100%",
        margin: 5,
    },
});

export default SignInForm;
