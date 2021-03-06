import React, {FunctionComponent} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../store/store';
import {makeStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import {InputLabel} from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import {NewUserInfo} from "../store/auth/types/newUserInfo";

import {registerNewUser, signOut} from '../store/auth/reducer'
import {SignInCredentials} from "../store/auth/types/signInCredentials";
import SessionCreator from "./SessionCreator";
import {Route, Switch} from 'react-router-dom';
import {signInAndFetchProfile} from "../store/auth/thunks";


const accounts: NewUserInfo[] = [
  {
    email: 'trevor@trevor.com',
    password: 'Password',
    username: 'Trevor',
    inviteCode: 'ilovetrees'
  }, {
    email: 'billy@trevor.com',
    password: 'Password',
    username: 'Billy',
    inviteCode: 'ilovetrees'
  }, {
    email: 'sam@trevor.com',
    password: 'Password',
    username: 'Sam',
    inviteCode: 'ilovetrees'
  }, {
    email: 'sherman@trevor.com',
    password: 'Password',
    username: 'Sherman',
    inviteCode: 'ilovetrees'
  },
];

//REDUX PROP TYPING


interface IDebugToolbarProps {}

const DebugToolbar: FunctionComponent<IDebugToolbarProps> = (props: IDebugToolbarProps) => {
  const classes = useStyles();

  const dispatch=useDispatch();

  const {email:profileEmail} = useSelector((state:RootState)=>state.profile)

  const register = (newUserInfo:NewUserInfo):void=> {
    dispatch(registerNewUser(newUserInfo));
  }

  const signInAccount = (credentials:SignInCredentials):void => {
    dispatch(signInAndFetchProfile(credentials));
  }

  function signInAs(email: string): void {
    dispatch(signOut())
    accounts.forEach(account => {
      if (account.email === email) signInAccount({
        email: account.email,
        password: account.password
      });
    });
  }

  function registerAll(): void {
    accounts.forEach(account => register(account));
  }

  return <Paper className={classes.root}>
    <Grid
      container
      className={classes.container}
      spacing={1}>
      <Grid item  xs={3}>
        <Button
          variant="outlined"
          onClick={registerAll}>Mass Register</Button>
      </Grid>

      <Grid item xs={2} >
        <Button
          variant="outlined"
          onClick={()=>signInAs(accounts[0].email)}>Sign In</Button>
      </Grid>

      <Grid item xs={2} >
        <FormControl className={classes.viewAs}>
          <InputLabel id="view-as-label">View As</InputLabel>
          <Select
          id="view-as"
          labelId="view-as-label"
          value={profileEmail}
          onChange={(e: React.ChangeEvent<{ name?: string; value: unknown }>) => signInAs(e.target.value as string)}>

        {accounts.map(account => <MenuItem
          key={account.email}
          value={account.email}>{account.username}</MenuItem>)}
        </Select></FormControl>
      </Grid>
        <Grid item xs={5} >
          <Switch>
          <Route path={"/sessions"}/>
          <Route>
            <SessionCreator/>
          </Route>
          </Switch>
      </Grid>
    </Grid>
  </Paper>;
};

const useStyles = makeStyles({
  root: {
    padding: 20,
    flexGrow: 1,
  },
  container: {
    alignItems: 'flex-end'
  },
  viewAs: {
    width:'80%'
  },

});

export default DebugToolbar;
