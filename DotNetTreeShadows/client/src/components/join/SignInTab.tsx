import React, { FunctionComponent, useState } from "react";
import { useDispatch } from "react-redux";
import { makeStyles, Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import { SignInCredentials } from "../../store/auth/types/signInCredentials";
import { useTypedSelector } from "../../store";
import { Box } from '@material-ui/core';
import { useSignInRejectedMessage } from '../../store/auth/selectors';

interface SignInTabProps {
  credentials: SignInCredentials;
  setCredentials: (value: SignInCredentials) => void;
}

//COMPONENT
const SignInTab: FunctionComponent<SignInTabProps> = (
  props: SignInTabProps
) => {
  const { credentials, setCredentials } = props;
  const classes = useStyles();
  const dispatch = useDispatch();

  const [error, setError] = useState(false);
  const signInRejectedMessage = useSignInRejectedMessage();

  const setEmail = (email: string) =>
    setCredentials({
      ...credentials,
      email
    });
  const setPassword = (password: string) =>
    setCredentials({
      ...credentials,
      password
    });

  return (
      <Box className={classes.root}>
    <form noValidate autoComplete="off">
      <div>
        <TextField
          required
          id="email"
          label="email"
          type="email"
          autoComplete="email"
          className={classes.TextInput}
          value={credentials.email}
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
          value={credentials.password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setPassword(e.target.value)
          }
        />
      </div>
    </form>
      </Box>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  root: {minHeight:290},
  SignInForm: {},
  TextInput: {
    width: "100%",
    margin: 5
  }
}));

export default SignInTab;
