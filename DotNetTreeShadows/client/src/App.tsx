import React from 'react';
import './App.css';
import Layout from './components/Layout';

import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Box } from '@material-ui/core';
import NewApiTest from "./components/NewApiTest";

function App() {
  return (
    <Router>
      <Layout>
        <Box m={5}>

          <NewApiTest/>
        </Box>
      </Layout>
    </Router>);
}

export default App;
