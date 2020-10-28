import React, {FunctionComponent} from 'react';
import {useDispatch} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import {Box} from "@material-ui/core";
import ListItem from "@material-ui/core/ListItem";
import List from "@material-ui/core/List";
import ListItemText from "@material-ui/core/ListItemText";
import {Link, useRouteMatch} from "react-router-dom";

interface HomeSidebarProps {
}

//COMPONENT
const HomeSidebar: FunctionComponent<HomeSidebarProps> = (props: HomeSidebarProps) => {
    const {} = props;
    const classes = useStyles();
    const dispatch = useDispatch();
    let { path, url } = useRouteMatch();

    let sessionMatch = useRouteMatch({
        path: "/sessions",
        exact: true
    });

    let friendMatch = useRouteMatch({
        path: "/friends",
        exact: true
    });

    let accountMatch = useRouteMatch({
        path: "/account",
        exact: true
    });
    let rulesMatch = useRouteMatch({
        path: "/rules",
        exact: true
    });




    return (
        <Box p={2} className={classes.root}>
            <List>
                <ListItem selected={!!sessionMatch} button component={Link} to={"/sessions"}>
                    <ListItemText>Sessions</ListItemText>
                </ListItem>
                <ListItem  selected={!!friendMatch} button component={Link} to={"/friends"}>
                    <ListItemText>Friends</ListItemText>
                </ListItem>
                <ListItem  selected={!!accountMatch} button component={Link} to={"/account"}>
                    <ListItemText>Account</ListItemText>
                </ListItem>
                <ListItem  selected={!!rulesMatch} button component={Link} to={"/rules"}>
                    <ListItemText>Rules</ListItemText>
                </ListItem>
            </List>
        </Box>);
};

const useStyles = makeStyles({
    root: {}
});

export default HomeSidebar;

