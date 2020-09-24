import * as React from 'react';
import { connect } from 'react-redux';
import DebugCommands from './DebugCommands';

const Home = () => (
  <div>
    <h1>Tree Shadows</h1>
    <DebugCommands/>
  </div>
);

export default connect()(Home);
