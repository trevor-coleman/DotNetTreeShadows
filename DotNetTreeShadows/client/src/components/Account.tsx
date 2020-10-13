import React, {FunctionComponent, useState} from 'react';
import {useDispatch} from 'react-redux';
import {makeStyles, Theme} from '@material-ui/core/styles';
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import {useTypedSelector} from "../store";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from '@material-ui/icons/Edit';
import CancelIcon from '@material-ui/icons/Cancel';
import DoneIcon from '@material-ui/icons/Done';
import TextField from "@material-ui/core/TextField";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import {Profile} from "../store/profile/types/profile";
import {updateProfileAsync} from "../store/profile/actions";

interface AccountProps {
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {minWidth: 360},
    textInput: {width: "80%"}
}))

const ProfileTableRow = (props: { label: string, stateProp: "name"|"email", onCommit: (stateProp: keyof Profile, value: string) => void }) => {
    const {label, stateProp, onCommit} = props
    const [editing, setEditing] = useState();
    const initialValue = useTypedSelector(state => state.profile[stateProp])
    const [value, setValue] = useState(initialValue);
    const classes=useStyles()

    let startEdit = () => setEditing(true);
    let cancelEdit = () => {
        setValue(initialValue);
        setEditing(false);
    }
    let commitEdit = () => {
        onCommit( stateProp, value);
        setEditing(false);
    }

    return <ListItem>

             {editing ? <ListItemText><TextField
                     required
                     id={stateProp}
                     label={label}
                     type={stateProp == "name" ? "username":stateProp}
                     autoComplete={stateProp == "name" ? "username" : stateProp}
                     value={value}
                     className={classes.textInput}
                     onChange={e => setValue(e.target.value)}/></ListItemText> :
            <ListItemText primary={value} secondary={label}/>}

        <ListItemSecondaryAction>
            {editing
                ? <>
                    <IconButton onClick={cancelEdit}><CancelIcon color={"secondary"}/></IconButton>
                    <IconButton onClick={commitEdit}><DoneIcon color={"primary"}/></IconButton>
                </>
                : <IconButton onClick={startEdit}><EditIcon/></IconButton>}
        </ListItemSecondaryAction>
    </ListItem>
}

//COMPONENT
const Account: FunctionComponent<AccountProps> = (props: AccountProps) => {
    const {} = props;
    const dispatch = useDispatch();
    const profile = useTypedSelector(state => state.profile);
    const {name: username, email} = profile;

     const handleProfileCommit = async(profileProp:keyof Profile, value:string)=>{
        await dispatch(updateProfileAsync({
            profileProp,
            value,
            profile,
        }));
    }
    const classes = useStyles();

    return (
        <Container className={classes.root}><Paper><Box>
       <List>
                            <ProfileTableRow label={"Name"} stateProp={"name"} onCommit={handleProfileCommit}/>
                            <ProfileTableRow label={"Email"} stateProp={"email"} onCommit={handleProfileCommit}/>
       </List>

                </Box></Paper>
        </Container>
    );
};


export default Account;
