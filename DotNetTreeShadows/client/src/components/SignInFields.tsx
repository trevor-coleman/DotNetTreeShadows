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
import { useSignInRejectedMessage } from '../store/auth/selectors';

interface ISignInFieldsProps {
  hideButton?:boolean,
}

//COMPONENT
const SignInFields: FunctionComponent<ISignInFieldsProps> = (props: ISignInFieldsProps) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const signInRejectedMessage = useSignInRejectedMessage();

    const classes = useStyles();
    const dispatch = useDispatch();

    const signIn =async (credentials: SignInCredentials) => {
        dispatch(signInAndFetchProfile(credentials));
        }

    return <div>
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
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}/></div>
                <div><TextField
                    required
                    id="password"
                    label="password"
                    type="password"
                    autoComplete="password"
                    className={classes.TextInput} value={password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}/></div>
                <div><Button
                    variant="outlined"
                    disabled={email.length < 3 && password.length < 3}
                    color="primary" onClick={() => signIn({
                    email,
                    password
                })}>Sign In</Button></div>
            </form>
            {signInRejectedMessage ? <Alert severity="warning">{signInRejectedMessage}</Alert>:""}
        </div>;
};

const useStyles = makeStyles({
    SignInFields: {},
    TextInput: {
        width: "100%",
        margin: 5,
    },
});

export default SignInFields;
