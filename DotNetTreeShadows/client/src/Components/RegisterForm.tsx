import React, { FunctionComponent, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../store';
import { makeStyles } from '@material-ui/core/styles';
import { NewUserInfo } from '../store/system/types';
import { registerNewUserAsync } from '../store/system/thunks';
import { Container } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

//REDUX MAPPING
const mapStateToProps = (state: RootState) => {
    return {
        authInProgress: state.system.authInProgress,
    };
};

const mapDispatchToProps = {registerNewUser: (registerInformation: NewUserInfo) => registerNewUserAsync(registerInformation)};

//REDUX PROP TYPING
const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

interface IRegisterFormProps {}

type RegisterFormProps = IRegisterFormProps & PropsFromRedux;

//COMPONENT
const RegisterForm: FunctionComponent<RegisterFormProps> = (props: RegisterFormProps) => {
    const classes = useStyles();
    const {registerNewUser} = props;

    const [username, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');


    const passwordsDontMatch = confirmPassword.length > 0 && password !== confirmPassword;

    return <Card className={classes.RegisterForm} variant={"outlined"}>
        <CardContent>
        <Typography variant="h5">Register New User</Typography>
        <form
            noValidate>
            <div><TextField
                required
                id="username"
                label="username"
                autoComplete="username"
                className={classes.TextInput}
                value={username}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserName(e.target.value)} /></div>
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
                id="new-password"
                autoComplete="new-password"
                label="password"
                type="password"
                className={classes.TextInput} value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} /></div>
            <div><TextField
                required
                error={passwordsDontMatch}
                id="confirmPassword"
                label="Confirm Password"
                type="password"
                autoComplete="new-password"
                className={classes.TextInput} value={confirmPassword}
                helperText={passwordsDontMatch?"Passwords don't match":""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)} /></div>
            <div><Button
                variant="outlined"
                disabled={email.length<3 && password.length < 3 && passwordsDontMatch}
                color="primary" onClick={()=>registerNewUser({username, email, password})} >Register New User</Button></div>
        </form></CardContent>
    </Card>;
};

const useStyles = makeStyles({
    Header: {
      marginBottom:10
    },
    RegisterForm: {
    },
    TextInput: {
        width: "100%",
        margin: 5,
    },
});

export default connector(RegisterForm);
;
