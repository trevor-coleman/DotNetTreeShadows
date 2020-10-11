import React, {FunctionComponent} from 'react';
import {useDispatch} from 'react-redux';
import {makeStyles, Theme} from '@material-ui/core/styles';
import {Avatar} from "@material-ui/core";
import {useTypedSelector} from "../store";
import PersonIcon from '@material-ui/icons/Person';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
interface FriendAvatarProps {
    id?:string,
    addFriend?: boolean
}

//COMPONENT
const FriendAvatar: FunctionComponent<FriendAvatarProps> = (props: FriendAvatarProps) => {
    const {id, addFriend} = props;

    const dispatch = useDispatch();
    const {friends, id:userId, name:userName} = useTypedSelector(state => state.profile)

    const name = userId == id ? userName : friends.find(f=>f.id == id)?.name;

    const initials = name ? name.split(' ').map(x => x.charAt(0)).join('').substr(0, 2).toUpperCase() : "";

    const stringToHslColor= (str:string, s:number, l:number): string => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }

        const h = hash % 360;
        return 'hsl('+h+', '+s+'%, '+l+'%)';
    }

    const friendColor = name ? stringToHslColor(name, 60,70) : "#363636";

    const classes = useStyles({friendColor});

    return (
        <Avatar className={classes.avatar}>
            {initials
                ? initials
                : addFriend
                    ? <PersonAddIcon/>
                    :<PersonIcon/>
            }
        </Avatar>);
};

const useStyles = makeStyles((theme:Theme)=>({
    avatar: {
        color: ({friendColor}:{friendColor:string})=>theme.palette.getContrastText(friendColor),
        backgroundColor: ({friendColor}:{friendColor:string})=>friendColor
    }
}));



export default FriendAvatar;
