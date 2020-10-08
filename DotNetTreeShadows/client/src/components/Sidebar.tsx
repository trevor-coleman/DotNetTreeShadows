import React from 'react';
import BuyingGrid from './BuyingGrid';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import TurnActionButtons from './TurnActionButtons';

const Sidebar = () => {
  return <div>
    <TurnActionButtons/>
    <Divider/>
    <BuyingGrid width={250}/>
    <Divider/>

  </div>
}

export default Sidebar;
