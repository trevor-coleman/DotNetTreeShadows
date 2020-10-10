import React, {FunctionComponent} from 'react';
import {useDispatch} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';


interface AccountProps {
}

//COMPONENT
const Account: FunctionComponent<AccountProps> = (props: AccountProps) => {
    const {} = props;
    const classes = useStyles();
    const dispatch = useDispatch();

    return (
        <div className={classes.root}>
            Account
        </div>);
};

const useStyles = makeStyles({
    root: {}
});

export default Account;
