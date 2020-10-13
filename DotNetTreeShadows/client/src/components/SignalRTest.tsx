import React, {FunctionComponent, useState} from 'react';
import {useDispatch} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import {Button} from "@material-ui/core";
import {sendMessage} from "../store/signalR/listeners";
import {useTypedSelector} from "../store";
import TextField from "@material-ui/core/TextField";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";


interface SignalRTestProps {
}

//COMPONENT
const SignalRTest: FunctionComponent<SignalRTestProps> = (props: SignalRTestProps) => {
    const {} = props;
    const classes = useStyles();
    const dispatch = useDispatch();
    const {messages} = useTypedSelector(state => state.signalR)

    const {id} = useTypedSelector(state => state.profile)

    const[message,setMessage] = useState("");
    const doSendMessage =() =>{
        sendMessage(id, message);
        setMessage("")
    }

    return (
        <div className={classes.root}>

            <TextField id="standard-basic" label="Standard" value={message} onChange={e=>setMessage(e.target.value)} />
            <Button variant={"outlined"} onClick={()=>doSendMessage()}>Send</Button>

            <Divider/>
            {messages.map(m=><Typography>{m.message}</Typography>)}
        </div>);
};

const useStyles = makeStyles({
    root: {}
});

export default SignalRTest;
