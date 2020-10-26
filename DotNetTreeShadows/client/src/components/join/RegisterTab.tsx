import React, { FunctionComponent, useState } from "react";
import { useDispatch } from "react-redux";
import TextField from "@material-ui/core/TextField";
import { NewUserInfo } from "../../store/auth/types/newUserInfo";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { Theme } from "@material-ui/core";
import Box from '@material-ui/core/Box';

interface RegisterTabProps {
  info: NewUserInfo & {confirmPassword:string};
  setInfo: (newInfo: NewUserInfo & { confirmPassword: string }) => void;
}

//COMPONENT
const RegisterTab: FunctionComponent<RegisterTabProps> = (
  props: RegisterTabProps
) => {
  const { info, setInfo } = props;
  const classes = useStyles();
  const dispatch = useDispatch();

  const setUsername = (username: string) =>
    setInfo({
      ...info,
      username
    });
  const setEmail = (email: string) =>
    setInfo({
      ...info,
      email
    });
  const setPassword = (password: string) =>
    setInfo({
      ...info,
      password
    });

  const setConfirmPassword = (confirmPassword: string) => setInfo({
    ...info,
    confirmPassword
  });

  let confirmPasswordError =
    info.confirmPassword.length > 0 && info.password != info.confirmPassword;

  return (
      <Box className={classes.root}>
    <form noValidate autoComplete="off">
      <div>
        <TextField
          required
          id="username"
          label="username"
          autoComplete="username"
          className={classes.TextInput}
          value={info.username}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setUsername(e.target.value)
          }
        />
      </div>
      <div>
        <TextField
          required
          id="email"
          label="email"
          type="email"
          autoComplete="email"
          className={classes.TextInput}
          value={info.email}
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
          value={info.password}
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
            confirmPasswordError ? "Passwords must match" : "confirm password"
          }
          type="password"
          autoComplete="password"
          className={classes.TextInput}
          value={info.confirmPassword}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setConfirmPassword(e.target.value)
          }
        />
      </div>
    </form>
      </Box>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  root: {minHeight: 290},
  SignInForm: {},
  TextInput: {
    width: "100%",
    margin: 5
  }
}));

export default RegisterTab;
