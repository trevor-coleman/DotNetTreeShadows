import React, { FunctionComponent } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { fetchUserProfileAsync } from '../store/middleware/thunks';
import { RootState } from '../store';
import { Typography, TableRow, TableCell, Button, Container, TableBody } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import { makeStyles } from '@material-ui/core/styles';

//REDUX MAPPING
const mapStateToProps = (state: RootState) => {
    return {
        profile: state.user.profile,
    };
};

const mapDispatchToProps = {fetchProfile: () => fetchUserProfileAsync()};

//REDUX PROP TYPING
const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

interface IReduxTestProps {}

type ReduxTestProps = IReduxTestProps & PropsFromRedux;

//COMPONENT
const ReduxTest: FunctionComponent<ReduxTestProps> = (props: ReduxTestProps) => {
    const classes = useStyles();
    const {profile} = props;

    console.log("props", props);

    return <Container className={classes.ReduxTest}>
        <Typography variant="h1">Redux Test!</Typography>
            <Table className={classes.Table}>
                <TableBody>
            {profile
             ? <>

                     {Object.getOwnPropertyNames(profile).map(
                         (key:string)=>
                             <TableRow key={key}><TableCell className={classes.Bold}>
                                {key}
                     </TableCell>
                         <TableCell>
                             {profile[key].toString()}
                         </TableCell></TableRow>)}


             </>
             : <TableRow><TableCell>No data</TableCell></TableRow>}</TableBody></Table>
        `
        <Button
            onClick={() => {
                console.log("fetching", props);
                props.fetchProfile();
            }}>Button</Button>
    </Container>;
};

const useStyles = makeStyles({
    ReduxTest: {width: 600},
    Bold: {fontWeight: 700},
    Table: {width: 300},
});

export default connector(ReduxTest);
;
