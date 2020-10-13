import React, {FunctionComponent} from 'react';
import {useDispatch} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import ListTurnOrder from "./game/ListTurnOrder";


interface SessionSidebarProps {
}

//COMPONENT
const SessionSidebar: FunctionComponent<SessionSidebarProps> = (props: SessionSidebarProps) => {
    const {} = props;
    const classes = useStyles();
    const dispatch = useDispatch();

    return (
        <div className={classes.root}>
            <ListTurnOrder/>
        </div>);
};

const useStyles = makeStyles({
    root: {}
});

export default SessionSidebar;
