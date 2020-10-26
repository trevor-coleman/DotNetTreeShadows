import React from 'react';
import './App.css';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import {CssBaseline} from "@material-ui/core";
import HomeScreen from "./components/views/HomeScreen";
import GameScreen from "./components/game/GameScreen";
import SignIn from "./components/views/SignIn";
import PrivateRoute from "./routes/PrivateRoute";
import Join from './components/join/Join';
import JoinSessionRoute from './routes/JoinSessionRoute';

function App() {
    return (
        <Router>
            <CssBaseline/>
            <Switch> 
                <PrivateRoute exact path={"/sessions/:sessionId"}><GameScreen/></PrivateRoute>
                <JoinSessionRoute path={"/join/:sessionId"}/>
                <Route exact path={"/auth"} component={SignIn}/>
                <PrivateRoute path={"/"} component={HomeScreen}><HomeScreen/></PrivateRoute>
            </Switch>
        </Router>);
}

export default App;
