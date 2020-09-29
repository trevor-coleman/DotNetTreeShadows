import React, { FunctionComponent, PropsWithChildren, Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../store';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';

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

  const {children} = props;

  return <div><AppBar position={'static'}>
      <Toolbar>

      <Typography variant={'h6'}>Tree Shadows</Typography>
      </Toolbar>
    </AppBar>
    {children? children:""}
  </div>;
};

const useStyles = makeStyles({});

export default connector(Layout);
