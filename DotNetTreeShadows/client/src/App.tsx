import React from 'react';
import './App.css';
import Layout from './views/Layout';

import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Box } from '@material-ui/core';
import NewApiTest from "./components/NewApiTest";
import PersistentDrawerRight from "./views/DrawerExample";
import GameBoard from "./components/GameBoard";

function App() {
  return (
    <Router>
      <PersistentDrawerRight>
          <GameBoard/>
      </PersistentDrawerRight>
    </Router>);
}

export default App;
