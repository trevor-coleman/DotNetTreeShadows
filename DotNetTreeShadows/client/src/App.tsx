import React from 'react';
import './App.css';

import DebugTest from './components/DebugTest';
import Layout from './components/Layout';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import SignedOut from './routes/auth/SignedOut';

function App() {
  return (
    <Layout><DebugTest/></Layout>);
}

export default App;
