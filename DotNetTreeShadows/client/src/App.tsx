import React from 'react';
import './App.css';
import Layout from './components/Layout';

import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Box } from '@material-ui/core';
import BuyingGrid from './components/BuyingGrid';
import Paper from '@material-ui/core/Paper';
import SVGTreeToken from './components/SVGTreeToken';
import TreeTokenTest from './components/TreeTokenTest';
import GameBoard from './components/GameBoard';
import NormalizrTest from "./components/NormalizerTest";
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
