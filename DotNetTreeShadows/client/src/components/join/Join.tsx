import React, { FunctionComponent, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { useParams } from "react-router-dom";
import { useSignedIn, signIn } from "../../store/auth/reducer";
import { joinSession } from "../../store/session/actions";
import { DialogContent, DialogActions } from "@material-ui/core";
import GameScreen from "../game/GameScreen";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import Box from "@material-ui/core/Box";
import { SignInCredentials } from "../../store/auth/types/signInCredentials";
import SignInTab from "./SignInTab";
import Button from "@material-ui/core/Button";
import RegisterTab from "./RegisterTab";
import { NewUserInfo } from "../../store/auth/types/newUserInfo";
import { useJoin } from "../../store/appState/reducer";
import { RequestState } from "../../api/requestState";
import { registerAndSignIn } from "../../store/auth/thunks";
import CircularProgress from "@material-ui/core/CircularProgress";
import DialogContentText from "@material-ui/core/DialogContentText";

interface JoinProps {
  sessionId: string;
}

//COMPONENT
const Join: FunctionComponent<JoinProps> = (props: JoinProps) => {
  const { sessionId } = useParams();
  const classes = useStyles();
  const signedIn = useSignedIn();
  const { requestState } = useJoin();
  const dispatch = useDispatch();
  const [value, setValue] = useState(0);

  const [credentials, setCredentials] = useState<SignInCredentials>({
    email: "",
    password: ""
  });
  const [info, setInfo] = useState<NewUserInfo & { confirmPassword: string }>({
    email: "",
    password: "",
    username: "",
    inviteCode: "ilovetrees",
    confirmPassword: ""
  });

  async function whenSignedIn(id: string) {}

  useEffect(() => {
    if (signedIn) {

      if (requestState != RequestState.Idle ) return;
      dispatch(joinSession(sessionId));
    }
  }, [signedIn]);

  function a11yProps(index: any) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`
    };
  }

  function handleSignIn() {
    dispatch(signIn(credentials));
  }

  async function handleRegister() {
    const newUserInfo = {
      ...info,
      confirmPassword: undefined
    };
    await dispatch(registerAndSignIn(newUserInfo));
  }

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  const disabled =
    value == 1
      ? info.email.length < 3 ||
        info.password.length < 3 ||
        info.password != info.confirmPassword
      : credentials.email.length < 3 || credentials.password.length < 3;

  return (
    <>
      <GameScreen dummy />
      <Dialog open={requestState == RequestState.Pending}>
        <DialogContent>
          <DialogTitle>Joining Session</DialogTitle>
          <CircularProgress />
          <DialogActions>
          <Button onClick={() => {
            dispatch(joinSession(sessionId));
          }}>
            Retry
          </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
      <Dialog open={requestState == RequestState.Rejected}>
        <DialogContent>
          <DialogTitle>Unable to Join Session</DialogTitle>
          <DialogActions>
            <Button
              onClick={() => {
                dispatch(joinSession(sessionId));
              }}
            >
              Retry
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
      <Dialog open={!signedIn} aria-labelledby="form-dialog-title">
        <DialogContent>
          <DialogTitle id="form-dialog-title">
            Sign In or Register to Join Session
          </DialogTitle>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="simple tabs example"
          >
            <Tab label="Sign In" {...a11yProps(0)} />
            <Tab label="Register" {...a11yProps(1)} />
          </Tabs>
          <TabPanel value={value} index={0}>
            <SignInTab
              credentials={credentials}
              setCredentials={setCredentials}
            />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <RegisterTab info={info} setInfo={setInfo} />
          </TabPanel>
          <DialogActions>
            <Button>Cancel</Button>
            {value == 0 ? (
              <Button
                disabled={disabled}
                color="primary"
                onClick={handleSignIn}
              >
                Sign In
              </Button>
            ) : (
              <Button
                disabled={disabled}
                color="primary"
                onClick={handleRegister}
              >
                Register
              </Button>
            )}
          </DialogActions>
        </DialogContent>
      </Dialog>
    </>
  );
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  dialog: {
    minHeight: 438
  }
}));

export default Join;
