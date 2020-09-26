import React from 'react';
import './App.css';

import ReduxTest from './Components/ReduxTest';
import SignInForm from './Components/SignInForm';
import RegisterForm from './Components/RegisterForm';
import { Container } from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';

function App() {
    const styles = useStyles();

  return (
    <div>
        <Container className={styles.App}>
        <SignInForm/>
        <RegisterForm/>
        </Container>
    </div>
  );
}

const useStyles = makeStyles({
    App: {
        backgroundColor: '#444',
        padding:20
    }
})

export default App;
