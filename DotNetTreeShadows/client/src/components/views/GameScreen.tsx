import React, {useEffect} from 'react';
import {makeStyles, useTheme, Theme, createStyles} from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import GameSidebar from '../game/GameSidebar'
import Box from "@material-ui/core/Box";
import GameBoard from "../game/GameBoard";
import {IconButton} from "@material-ui/core";
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import {Link, useParams} from "react-router-dom";
import {useDispatch} from "react-redux";
import {useTypedSelector} from "../../store";
import {RequestState} from "../../api/requestState";
import {fetchSession, clearSession} from "../../store/session/reducer";
import GameInfoBar from "../game/GameInfoBar";


const drawerWidth = 280;

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
        },
        appBar: {
            zIndex: theme.zIndex.drawer + 1,
        },
        hide: {
            display: 'none',
        },
        drawer: {
            width: drawerWidth,
            flexShrink: 0,
        },
        drawerPaper: {
            width: drawerWidth,
        },
        drawerHeader: {
            display: 'flex',
            alignItems: 'center',
            padding: theme.spacing(0, 1),
            // necessary for content to be below app bar
            ...theme.mixins.toolbar,
            justifyContent: 'flex-start',
        },
        content: {
            alignItems: 'flex-start',
            marginLeft: drawerWidth,
            width: "95vmin",
            marginTop: 64,
            border: '1px dotted red',
        },
        sessionName: {
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis"
        },
        title: {
            paddingTop: theme.spacing(1),
            paddingLeft: theme.spacing(2),
        },
        podbar: {
            borderTop: '2px solid grey',
            bottom: 0,
            position: "fixed",
            zIndex: 150,
            _position: "absolute",
            _top: "expression(eval(document.documentElement.scrollTop+(document.documentElement.clientHeight-this.offsetHeight)))",
            width: 800,
            height: 64
        },
        menuIcon: {
            color: "white"
        }
    }),
);

interface IGameScreenProps {
}

export default function GameScreen(props: IGameScreenProps) {
    const classes = useStyles();
    const theme = useTheme();
    const [open, setOpen] = React.useState(true);
    const {sessionId: sessionIdFromPath} = useParams();
    const {id: sessionIdFromState, loadingSessionState, name: sessionName} = useTypedSelector(state => state.session);
    const dispatch = useDispatch();

    const loadSession= async ()=>{
        await dispatch(fetchSession(sessionIdFromPath))
    }

    const shouldLoadSession = (sessionIdFromState != sessionIdFromPath) && (loadingSessionState != RequestState.Pending);

    useEffect(()=> {
        if(shouldLoadSession) {
            loadSession()
        }
    })





    const toggleDrawerOpen = () => {
        setOpen(!open);
    };

    return (
        <div className={classes.root}>
            <AppBar
                position="fixed"
                className={classes.appBar}
            >
                <Toolbar>
                    <IconButton component={Link} to={'/sessions'}><ArrowBackIosIcon className={classes.menuIcon}/></IconButton>
                    <Typography variant="h6" noWrap>
                        TreeShadows - {sessionName}
                    </Typography>
                </Toolbar>
            </AppBar>
            <Box p={3} className={classes.content}>
                <GameInfoBar/>
                <GameBoard/>
            </Box>
            <Drawer
                className={classes.drawer}
                variant="persistent"
                anchor="left"
                open={open}
                classes={{
                    paper: classes.drawerPaper,
                }}
            >
                <div className={classes.drawerHeader}/>
                <GameSidebar/>
            </Drawer>
        </div>
    );
}
