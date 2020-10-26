import React, { FunctionComponent, PropsWithChildren } from "react";
import { useDispatch } from "react-redux";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { Route, Redirect, RouteProps, useParams } from "react-router-dom";
import { useSignedIn } from "../store/auth/reducer";
import { useJoin } from "../store/appState/reducer";
import { RequestState } from "../api/requestState";
import Join from "../components/join/Join";
import { sign } from 'crypto';

type JoinSessionRouteProps = PropsWithChildren<RouteProps>;

//COMPONENT
const JoinSessionRoute: FunctionComponent<JoinSessionRouteProps> = (
  props: JoinSessionRouteProps
) => {
  const { children, ...rest } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const signedIn = useSignedIn();
  const { requestState, requestSession } = useJoin();



  return (
    <Route {...rest}>
      {({ location }) => {
        console.log(signedIn, requestState, requestSession)
        return signedIn && requestState == RequestState.Fulfilled ? (
          <Redirect
            to={{
              pathname: `/sessions/${requestSession}`,
              state: { from: location }
            }}
          />
        ) : (
          <Join sessionId={""} />
        );
      }}
    </Route>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  root: {}
}));

export default JoinSessionRoute;
