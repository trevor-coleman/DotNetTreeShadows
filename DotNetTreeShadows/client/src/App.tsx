import React from 'react';
import './App.css';
import GameScreen from './components/views/GameScreen';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import GameBoard from "./components/game/GameBoard";
import DebugToolbar from './components/DebugToolbar';
import {CssBaseline} from "@material-ui/core";
import HomeScreen from "./components/views/HomeScreen";

function App() {
    return (
        <Router>
            <CssBaseline/>
            <Switch>
                <Route exact path={"/sessions/:sessionId"} component={GameScreen}/>
                <Route path={"/"} component={HomeScreen}/>
            </Switch>
        </Router>);
}

export default App;
