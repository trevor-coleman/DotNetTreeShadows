import React from 'react';
import {makeStyles, useTheme, Theme, createStyles} from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import PlayerSidebar from '../game/playerSidebar/PlayerSidebar'
import Box from "@material-ui/core/Box";
import GameBoard from "../game/board/GameBoard";
import {IconButton} from "@material-ui/core";
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import {Link, useParams} from "react-router-dom";
import {useDispatch} from "react-redux";
import {useTypedSelector} from "../../store";
import Grid from "@material-ui/core/Grid";
import SessionSidebar from "../game/sessionSidebar/SessionSidebar";

const leftDrawerWidth = 280;
const rightDrawerWidth = 500;

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
        leftDrawer: {
            width: leftDrawerWidth,
            flexShrink: 0,
        },
        rightDrawer: {
            width: rightDrawerWidth,
            flexShrink: 0,
        },
        drawerPaper: {
            width: leftDrawerWidth,
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
            marginLeft: leftDrawerWidth,
            marginRight: rightDrawerWidth,
            marginTop: 64,
            border: "3px dashed magenta"
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
        },
        gameBoard: {
            width: '90vh',
            margin: "auto"
        },
        gameBoardGrid: {
            alignSelf: 'center',
            width: '100vh',
            margin: "auto",
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
    const {id: sessionIdFromState, loadingSessionState, name: sessionName, firstLoad} = useTypedSelector(state => state.session);
    const dispatch = useDispatch();




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
                    <IconButton component={Link} to={'/sessions'}><ArrowBackIosIcon
                        className={classes.menuIcon}/></IconButton>
                    <Typography variant="h6" noWrap>
                        TreeShadows - {sessionName}
                    </Typography>
                </Toolbar>
            </AppBar>
            <Box className={classes.content}>
                <Grid container className={classes.gameBoardGrid}>
                    <Grid item xs={12}>
                        <GameBoard/>
                    </Grid>
                </Grid>
            </Box>
            <Drawer
                className={classes.leftDrawer}
                variant="persistent"
                anchor="left"
                open={open}
                classes={{
                    paper: classes.drawerPaper,
                }}
            >
                <div className={classes.drawerHeader}/>
                <PlayerSidebar/>
            </Drawer>
            <Drawer
                className={classes.rightDrawer}
                variant="persistent"
                anchor="right"
                open={open}
                classes={{
                    paper: classes.drawerPaper,
                }}
            >
                <div className={classes.drawerHeader}/>
                <SessionSidebar/>
            </Drawer>
        </div>
    );
}
