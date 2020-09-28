import React from 'react';
import './App.css';

import DebugTest from './components/DebugTest';
import Layout from './components/Layout';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import SignedOut from './routes/auth/SignedOut';
import Piece from './components/Piece';
import { Box } from '@material-ui/core';
import BuyingGrid from './components/BuyingGrid';

function App() {
  return (
    <Layout><Box m={5}><BuyingGrid/></Box></Layout>);
}

export default App;
