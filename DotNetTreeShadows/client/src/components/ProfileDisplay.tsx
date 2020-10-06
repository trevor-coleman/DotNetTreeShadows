import React, { FunctionComponent } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../store';
import { Typography, TableRow, TableCell, Button, Container, TableBody } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import { makeStyles } from '@material-ui/core/styles';
import { fetchUserProfileAsync } from '../store/z_old-user/thunks';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

//REDUX MAPPING
const mapStateToProps = (state: RootState) => {
    return {
        profile: state.user.profile,
        friends: state.friends.friends,

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
    const {profile, friends} = props;

    return <Card className={classes.ProfileDisplay}>
      <CardContent>
        <Typography variant="h5">{profile ? profile.name : "Signed Out"}</Typography>
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
                             {key ==='friends' ? friends.map(friend=>friend.name + " ") : profile[key].toString() }
                         </TableCell></TableRow>)}


             </>
             : <TableRow><TableCell>No data</TableCell></TableRow>}</TableBody></Table>
        `
        <Button
            onClick={() => {
                console.log("fetching", props);
                props.fetchProfile();
            }}>Button</Button>
      </CardContent>
    </Card>;
};

const useStyles = makeStyles({
    ProfileDisplay: {},
    Bold: {fontWeight: 700},
    Table: {width: 300},
});

export default connector(ProfileDisplay);
;
