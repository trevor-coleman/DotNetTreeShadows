import React from 'react';
import { Container, Grid, Box } from '@material-ui/core';
import SignInForm from './SignInForm';
import RegisterForm from './RegisterForm';
import AddFriendForm from './AddFriendForm';
import ReduxTest from './ProfileDisplay';
import makeStyles from '@material-ui/core/styles/makeStyles';
import InvitationList from './InvitationList';
import SessionCreator from './SessionCreator';
import DebugToolbar from './DebugToolbar';

const DebugTest = () => {

  const styles = useStyles();

  return <Container>
      <Grid container spacing={3}>
        <Grid item xs={12}>
      <DebugToolbar/>
        </Grid>
      </Grid>
      <Grid
        container
        spacing={3}>
        <Grid
          container
          spacing={3}
          xs={12}
          item>
          <Grid
            item
          >
            <SignInForm />
          </Grid>
          <Grid item>
            <RegisterForm />
          </Grid>
          <Grid item><InvitationList /></Grid>
        </Grid>
        <Grid
          container
          spacing={3}
        >
          <Grid item><AddFriendForm /></Grid>
          <Grid item><ReduxTest /></Grid>
          <Grid item><SessionCreator /></Grid>
        </Grid>

      </Grid>
  </Container>;

};

const useStyles = makeStyles({

});

export default DebugTest;
