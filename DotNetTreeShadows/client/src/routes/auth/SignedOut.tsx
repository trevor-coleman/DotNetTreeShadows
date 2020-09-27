import React, { FunctionComponent, Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../../store';
import { makeStyles } from '@material-ui/core/styles';
import { Tabs } from '@material-ui/core';
import Tab from '@material-ui/core/Tab';
import AppBar from '@material-ui/core/AppBar';
import SignInForm from '../../components/SignInForm';
import RegisterForm from '../../components/RegisterForm';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';

//REDUX MAPPING
const mapStateToProps = (state: RootState) => {
  return {};
};

const mapDispatchToProps = {};

//REDUX PROP TYPING
const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

interface ISignedOutProps {}

type SignedOutProps = ISignedOutProps & PropsFromRedux;

function TabPanel(props: {component: React.FunctionComponentElement<any>, value:any, index:any}) {
  const { component, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          {component}
        </Box>
      )}
    </div>
  );
}
//COMPONENT
const SignedOut: FunctionComponent<SignedOutProps> = (props: SignedOutProps) => {
  const classes = useStyles();

  const [value, setValue] = React.useState(0);
  const {} = props;


  const handleChange = (event: React.ChangeEvent<{}>, newValue: React.SetStateAction<number>) => {
    setValue(newValue);
  };

  function a11yProps(index:number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  return <><AppBar position={'static'}><Tabs value={value} onChange={(e, v:number)=>handleChange(e,v)} aria-label="simple tabs example">
    <Tab label="Sign In" {...a11yProps(0)} />
    <Tab label="Register" {...a11yProps(1)} />
  </Tabs></AppBar>
    <Container className={classes.App}>
<TabPanel value={value} index={0} component={<SignInForm/>}/>
<TabPanel value={value} index={1} component={<RegisterForm/>}/>
  </Container></>;
};

const useStyles = makeStyles({App: {
    backgroundColor: '#444',
    padding: 20,
    flexGrow: 1,
  }});

export default connector(SignedOut);
