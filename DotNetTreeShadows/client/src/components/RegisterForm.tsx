import React, {FunctionComponent, useState} from 'react';
import {useDispatch} from 'react-redux';
import {makeStyles, Theme} from '@material-ui/core/styles';
import {registerAndSignIn} from "../store/auth/thunks";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import {NewUserInfo} from "../store/auth/types/newUserInfo";
import {useHistory, useLocation} from "react-router-dom";
import {LocationState} from "../routes/LocationState";


interface RegisterFormProps {
}

//COMPONENT
const RegisterForm: FunctionComponent<RegisterFormProps> = (props: RegisterFormProps) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();
    const location = useLocation<LocationState>();
    const {from} = location.state || {from: {pathname: "/"}};

    const signIn = async (newUserInfo: NewUserInfo) => {

        try {
            await dispatch(registerAndSignIn(newUserInfo))
            history.push("/");
        } catch (e) {
            console.log(e);
        }
    }


    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [inviteCode, setInviteCode] = useState('');

    let confirmPasswordError = confirmPassword.length > 0 && password != confirmPassword;
    return <Card className={classes.root}>
        <CardContent>
            <Typography variant="h5">Register</Typography>
            <form
                noValidate
                autoComplete="off">
                <div><TextField
                    required
                    id="username"
                    label="username"
                    autoComplete="username"
                    className={classes.TextInput}
                    value={username}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}/></div>
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
                <div><TextField
                    required
                    error={confirmPasswordError}
                    id="confirm-password"
                    label={confirmPasswordError
                        ? "Passwords must match"
                        : "confirm password"}
                    type="password"
                    autoComplete="password"
                    className={classes.TextInput} value={confirmPassword}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}/></div>
                <div><TextField
                    required
                    id="invite-code"
                    label="invitation code"
                    className={classes.TextInput} value={inviteCode}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInviteCode(e.target.value)}/></div>
                <div><Button
                    variant="outlined"
                    disabled={email.length < 3 || password.length < 3 || password != confirmPassword}
                    color="primary" onClick={() => signIn({
                    username,
                    email,
                    password,
                    inviteCode,
                })}>Register</Button></div>
            </form>
        </CardContent>
    </Card>;
};

const useStyles = makeStyles((theme: Theme) => ({
    root: {},
    TextInput: {
        width: "100%",
        margin: 5,
    },
}));

export default RegisterForm;
