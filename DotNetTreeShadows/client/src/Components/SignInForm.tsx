import React, { FunctionComponent, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../store';
import { makeStyles } from '@material-ui/core/styles';
import { SignInCredentials } from '../store/system/types';
import { signInUserAsync } from '../store/system/thunks';
import { Container } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CardContent from '@material-ui/core/CardContent';
import Card from '@material-ui/core/Card';

//REDUX MAPPING
const mapStateToProps = (state: RootState) => {
    return {
        authInProgress: state.system.authInProgress,
    };
};

const mapDispatchToProps = {signIn: (signInCredentials: SignInCredentials) => signInUserAsync(signInCredentials)};

//REDUX PROP TYPING
const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

interface ISignInFormProps {}

type SignInFormProps = ISignInFormProps & PropsFromRedux;

//COMPONENT
const SignInForm: FunctionComponent<SignInFormProps> = (props: SignInFormProps) => {
    const classes = useStyles();
    const {signIn} = props;
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return <Card className={classes.SignInForm}>
        <CardContent>
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
        width: 360,
        margin: 20
    },
    TextInput: {
        width: 300,
        margin: 5,
    },
});

export default connector(SignInForm);
;
