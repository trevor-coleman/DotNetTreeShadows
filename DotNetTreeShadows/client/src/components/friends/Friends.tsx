import React, {FunctionComponent, useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import {Box} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import DebugToolbar from "../DebugToolbar";
import AddFriendCard from "./AddFriendCard";
import FriendRequestList from "./FriendRequestList";
import FriendList from "./FriendList";
import Grid from "@material-ui/core/Grid";
import {fetchFriendProfiles, fetchProfile} from "../../store/profile/actions";
import {fetchInvitations} from "../../store/invitations/actions";

interface FriendsProps {
}

//COMPONENT
const Friends: FunctionComponent<FriendsProps> = (props: FriendsProps) => {
    const {} = props;
    const classes = useStyles();
    const dispatch = useDispatch();

    const onLoad = async ()=> {
        await dispatch(fetchProfile());
        await dispatch(fetchInvitations());
    }

    useEffect(()=>{
        onLoad();
    }, [])

    return (
        <Box p={3} className={classes.root}>
            <Grid container spacing={2}>
                <Grid item xs={8}>
                    <Typography variant={"h5"}>Friends</Typography>
                    <Divider/>
                </Grid>
                <Grid item xs={8}>
                    <AddFriendCard/></Grid>
                <Grid item xs={8}>
                    <FriendList/>
                </Grid>
                <Grid item xs={8}>
                    <FriendRequestList type={"received"}/>
                </Grid>
                <Grid item xs={8}>
                    <FriendRequestList type={"sent"}/>
                </Grid>
            </Grid>

        </Box>);
};

const useStyles = makeStyles({
    root: {width: "80vw"}
});

export default Friends;
