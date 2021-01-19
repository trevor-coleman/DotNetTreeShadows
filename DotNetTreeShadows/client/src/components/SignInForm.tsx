import React, {FunctionComponent, useState} from 'react';
import {useDispatch} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CardContent from '@material-ui/core/CardContent';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import {SignInCredentials} from "../store/auth/types/signInCredentials";
import {signInAndFetchProfile} from "../store/auth/thunks";
import {useTypedSelector} from "../store";
import Alert from '@material-ui/lab/Alert';
import SignInFields from './SignInFields';

interface ISignInFormProps {
}

//COMPONENT
const SignInForm: FunctionComponent<ISignInFormProps> = (props: ISignInFormProps) => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const signIn =async (credentials: SignInCredentials) => {
        dispatch(signInAndFetchProfile(credentials));
        }

    return <Card className={classes.SignInForm}>
        <CardContent>
            <Typography variant="h5">Sign In</Typography>
            <SignInFields/>
        </CardContent>
    </Card>;
};

const useStyles = makeStyles({
    SignInForm: {},
    TextInput: {
        width: "100%",
        margin: 5,
    },
});

export default SignInForm;
