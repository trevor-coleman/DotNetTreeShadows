import React from 'react';
import './App.css';

import ReduxTest from './Components/ProfileDisplay';
import SignInForm from './Components/SignInForm';
import RegisterForm from './Components/RegisterForm';
import { Container, Grid } from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';
import AddFriendForm from './Components/AddFriendForm';

function App() {
  const styles = useStyles();

  return (
    <div>
      <Container className={styles.App}>
        <Grid
          container
          spacing={3}>
          <Grid
            container
            spacing={3}
            item>
              <Grid item>
                <SignInForm />
              </Grid>
              <Grid item>
                <RegisterForm />
              </Grid>
          </Grid>
            <Grid container spacing={3}>
            <Grid item><AddFriendForm /></Grid>
            <Grid item><ReduxTest /></Grid>
            </Grid>
          </Grid>
      </Container>
    </div>);
}

const useStyles = makeStyles({
  App: {
    backgroundColor: '#444',
    padding: 20,
    flexGrow: 1,
  },
});

export default App;
