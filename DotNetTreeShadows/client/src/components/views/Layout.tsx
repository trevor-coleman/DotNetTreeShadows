import React, {FunctionComponent, PropsWithChildren, Component, useState} from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../../store/store';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import {Drawer} from "@material-ui/core";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import StarIcon from '@material-ui/icons/Star';
import MenuIcon from '@material-ui/icons/Menu';
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import IconButton from "@material-ui/core/IconButton";

//REDUX MAPPING
const mapStateToProps = (state: RootState) => {
  return {};
};

const mapDispatchToProps = {};

//REDUX PROP TYPING
const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

interface ILayoutProps {}

type LayoutProps = PropsWithChildren<ILayoutProps> & PropsFromRedux;

//COMPONENT
const Layout: FunctionComponent<LayoutProps> = (props: LayoutProps) => {
  const classes = useStyles();
    const [state, setState] = useState({drawerOpen: false});

    const handleCloseDrawer=(open:boolean) => (event: { type: string; key: string; }) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setState({...state, drawerOpen: open})
    }

    const toggleDrawer=()=> setState({...state, drawerOpen: !state.drawerOpen})

    const {children} = props;

  return <div><AppBar position={'static'}>
      <Toolbar>
          <IconButton
              aria-label={"menu"}
              className={classes.menuButton}
              onClick={()=>toggleDrawer()}
          ><MenuIcon/></IconButton>
      <Typography variant={'h6'}>Tree Shadows</Typography>
      </Toolbar>
    </AppBar>
      <Drawer anchor={'left'} open={state.drawerOpen} onClose={handleCloseDrawer(false)}>
          <List className={classes.drawerList}>
              <ListItem button>
                  <ListItemIcon>{<StarIcon/>}</ListItemIcon>
                  <ListItemText primary={"Hello"} />
              </ListItem>
          </List>
      </Drawer>
    {children? children:""}
  </div>;
};

const useStyles = makeStyles({menuButton:{color:"white"},
drawerList: {width:250}});

export default connector(Layout);
