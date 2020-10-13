import React, {FunctionComponent, PropsWithChildren} from 'react';
import {useDispatch} from 'react-redux';
import {makeStyles, Theme} from '@material-ui/core/styles';
import {Route, Redirect, RouteProps} from 'react-router-dom';
import {useTypedSelector} from "../store";


type PrivateRouteProps = PropsWithChildren<RouteProps>

//COMPONENT
const PrivateRoute: FunctionComponent<PrivateRouteProps> = (props: PrivateRouteProps) => {
    const {children, ...rest} = props;
    const classes = useStyles();
    const dispatch = useDispatch();
    const {signedIn} = useTypedSelector(state => state.auth)
    console.log("privateRoute:", signedIn);

    return (
        <Route {...rest}>
            {({location}) => {
                console.log("Rendering privateRoute", location);
                return signedIn ? (
                    children
                ) : (
                    <Redirect
                        to={{
                            pathname: "/auth",
                            state: {from: location}
                        }}
                    />
                );
            }
            }
        </Route>
    );
};

const useStyles = makeStyles((theme: Theme) => ({
    root: {}
}));

export default PrivateRoute;
