import React, { FunctionComponent, useState } from "react";
import { useDispatch } from "react-redux";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { registerAndSignIn } from "../store/auth/thunks";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { NewUserInfo } from "../store/auth/types/newUserInfo";
import { useHistory, useLocation } from "react-router-dom";
import { LocationState } from "../routes/LocationState";
import { useTypedSelector } from "../store";
import Alert from "@material-ui/lab/Alert";
import {
  useRegisterRejectedMessage, useCheckUsernameForDuplicates,
} from "../store/auth/selectors";
import { useSignedIn } from "../store/auth/reducer";
import { checkIfUsernameExists } from '../store/auth/actions';

interface RegisterFormProps {}

//COMPONENT
const RegisterForm: FunctionComponent<RegisterFormProps> = (
  props: RegisterFormProps
) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation<LocationState>();
  const signedIn = useSignedIn();
  const { from } = location.state || { from: { pathname: "/" } };
  const duplicateCheck = useCheckUsernameForDuplicates();

  const signIn = async (newUserInfo: NewUserInfo) => {
    await dispatch(registerAndSignIn(newUserInfo));
    if (signedIn) history.push("/");
  };

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const registerRejectedMessage: string | null = useRegisterRejectedMessage();

  let confirmPasswordError =
    confirmPassword.length > 0 && password != confirmPassword;

  const isValidEmail = (candidate: string)=> {
    const validEmailRegEx = new RegExp(
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

    return validEmailRegEx.test(candidate);
  }

  const handleUsernameChange = (username: string) => {
    setUsername(username);
    if(username.length==0) return;
    dispatch(checkIfUsernameExists({ username, id: Date.now().toString()}));
  }

  const usernameLabel:string = username.length == 0 ? "username" : duplicateCheck.message || "username";


  const validEmailError = email.length > 0 && !isValidEmail(email);

  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography variant="h5">Register</Typography>
        <form noValidate autoComplete="off">
          <div>
            <TextField
              required
              id="username"
              error={duplicateCheck.result}
              label={usernameLabel}
              autoComplete="username"
              className={classes.TextInput}
              value={username}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleUsernameChange(e.target.value)
              }
            />
          </div>
          <div>
            <TextField
              required
              id="email"
              error={validEmailError}
              label={validEmailError ?  "enter a valid email":"email"}
              type="email"
              autoComplete="email"
              className={classes.TextInput}
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
            />
          </div>
          <div>
            <TextField
              required
              id="password"
              label="password"
              type="password"
              autoComplete="password"
              className={classes.TextInput}
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
            />
          </div>
          <div>
            <TextField
              required
              error={confirmPasswordError}
              id="confirm-password"
              label={
                confirmPasswordError
                  ? "Passwords must match"
                  : "confirm password"
              }
              type="password"
              autoComplete="password"
              className={classes.TextInput}
              value={confirmPassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setConfirmPassword(e.target.value)
              }
            />
          </div>
          <div>
            <TextField
              required
              id="invite-code"
              label="invitation code"
              className={classes.TextInput}
              value={inviteCode}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setInviteCode(e.target.value)
              }
            />
          </div>
          <div>
            <Button
              variant="outlined"
              disabled={
                password.length < 3 ||
                confirmPasswordError ||
                validEmailError
              }
              color="primary"
              onClick={() =>
                signIn({
                  username,
                  email,
                  password,
                  inviteCode
                })
              }
            >
              Register
            </Button>
          </div>
          {registerRejectedMessage ? (
            <Alert severity="warning">{registerRejectedMessage}</Alert>
          ) : (
            ""
          )}
        </form>
      </CardContent>
    </Card>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  TextInput: {
    width: "100%",
    margin: 5
  }
}));

export default RegisterForm;
