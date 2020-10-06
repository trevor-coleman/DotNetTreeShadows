import React, {FunctionComponent} from 'react';
import {connect, ConnectedProps} from 'react-redux';
import {RootState} from '../store';
import {makeStyles} from '@material-ui/core/styles';

//REDUX MAPPING
const mapStateToProps = (state: RootState) => {
    return {};
};

const mapDispatchToProps = {};

//REDUX PROP TYPING
const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

interface INewApiTestProps {
}

type NewApiTestProps =
    INewApiTestProps
    & PropsFromRedux;

//COMPONENT
const NewApiTest: FunctionComponent<NewApiTestProps> = (props: NewApiTestProps) => {
    const classes = useStyles();

    const {} = props;

    return <div>New Api Test</div>;
};

const useStyles = makeStyles({});

export default connector(NewApiTest);
