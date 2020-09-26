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

interface IProfileDisplayProps {}

type ProfileDisplayProps = IProfileDisplayProps & PropsFromRedux;

//COMPONENT
const ProfileDisplay: FunctionComponent<ProfileDisplayProps> = (props: ProfileDisplayProps) => {
    const classes = useStyles();
    const {profile} = props;

    console.log("props", props);

    return <div className={classes.ProfileDisplay}>
        <Typography variant="h5">Redux Test!</Typography>
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
    </div>;
};

const useStyles = makeStyles({
    ProfileDisplay: {},
    Bold: {fontWeight: 700},
    Table: {width: 300},
});

export default connector(ProfileDisplay);
;
