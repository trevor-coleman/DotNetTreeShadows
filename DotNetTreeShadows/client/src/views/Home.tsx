import React, {FunctionComponent} from 'react';
import {useDispatch} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import {Drawer} from "@material-ui/core";


interface HomeProps {
}

//COMPONENT
const Home: FunctionComponent<HomeProps> = (props: HomeProps) => {
    const {} = props;
    const classes = useStyles();
    const dispatch = useDispatch();



    return <div>
    </div>;
};

const useStyles = makeStyles({});

export default Home;
