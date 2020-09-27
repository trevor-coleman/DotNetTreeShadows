import React, { FunctionComponent } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../store';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import { signInUserAsync, registerNewUserAsync } from '../store/system/thunks';
import { NewUserInfo } from '../store/system/types';
import { InputLabel } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';

//REDUX MAPPING
const mapStateToProps = (state: RootState) => {
  return {};
};

const accounts: NewUserInfo[] = [
  {
    email: 'trevor@trevor.com',
    password: 'Password',
    username: 'Trevor',
  }, {
    email: 'billy@trevor.com',
    password: 'Password',
    username: 'Billy',
  }, {
    email: 'sam@trevor.com',
    password: 'Password',
    username: 'Sam',
  }, {
    email: 'sherman@trevor.com',
    password: 'Password',
    username: 'Sherman',
  },
];

const mapDispatchToProps = {
  signIn: (email: string, password: string) => signInUserAsync({
    email,
    password,
  }),
  register: (info: NewUserInfo) => registerNewUserAsync(info),
};

//REDUX PROP TYPING
const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

interface IDebugToolbarProps {}

type DebugToolbarProps = IDebugToolbarProps & PropsFromRedux;

//COMPONENT
const DebugToolbar: FunctionComponent<DebugToolbarProps> = (props: DebugToolbarProps) => {
  const classes = useStyles();

  const {signIn, register} = props;

  function signInAs(email: string): void {
    accounts.forEach(account => {
      if (account.email === email) signIn(account.email, account.password);
    });
  }

  function registerAll(): void {
    accounts.forEach(account => register(account));
  }

  return <Paper className={classes.root}>
    <Grid
      container
      spacing={1}>
      <Grid item xs={2}>
        Debug Toolbar
      </Grid>
      <Grid item xs={2}>
        <Button
          variant="outlined"
          onClick={registerAll}>Mass Register</Button>
      </Grid>
      <Grid item xs={2}>
        <FormControl className={classes.viewAs}>
          <InputLabel id="view-as-label">View As</InputLabel>
          <Select

          id="view-as"
          labelId="view-as-label"
          onChange={(e: React.ChangeEvent<{ name?: string; value: unknown }>) => signInAs(e.target.value as string)}>

        {accounts.map(account => <MenuItem
          key={account.email}
          value={account.email}>{account.username}</MenuItem>)}
        </Select></FormControl>
      </Grid>
    </Grid>
  </Paper>;
};

const useStyles = makeStyles({
  root: {
    padding: 20,
  },
  viewAs: {
    width:'80%'
  }
});

export default connector(DebugToolbar);
