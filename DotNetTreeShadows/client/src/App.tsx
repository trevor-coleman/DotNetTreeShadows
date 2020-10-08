import React from 'react';
import './App.css';
import Layout from './views/Layout';
import DrawerExample from './views/DrawerExample';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Box } from '@material-ui/core';
import NewApiTest from "./components/NewApiTest";
import PersistentDrawerRight from "./views/DrawerExample";
import GameBoard from "./components/GameBoard";
import DebugToolbar from './components/DebugToolbar';

function App() {
  return (
    <Router>
      <DrawerExample>
        <DebugToolbar/>
        <GameBoard/>
      </DrawerExample>
    </Router>);
}

export default App;
