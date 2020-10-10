import React, {PropsWithChildren} from 'react';
import {makeStyles, useTheme, Theme, createStyles} from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import GameSidebar from '../game/GameSidebar'
import Box from "@material-ui/core/Box";
import {IconButton} from "@material-ui/core";
import MenuIcon from '@material-ui/icons/Menu';
import {Link, Route, useRouteMatch} from "react-router-dom";
import HomeSidebar from "../HomeSidebar";
import Sessions from "../Sessions";
import Friends from "../Friends";
import Account from "../Account";


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
            marginTop: 64,
            marginLeft: drawerWidth,
            width:"90vmin"
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
            height: 128
        },
        menuIcon: {
            color: "white"
        }
    }),
);

interface IHomeScreenProps {}

export default function HomeScreen(props: IHomeScreenProps) {
    const classes = useStyles();
    let { path, url } = useRouteMatch();
    const theme = useTheme();
    const [open, setOpen] = React.useState(true);
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
                    <IconButton onClick={toggleDrawerOpen}><MenuIcon className={classes.menuIcon}/></IconButton>
                    <Typography variant="h6" noWrap>
                        TreeShadows
                    </Typography>

                </Toolbar>
            </AppBar>
            <Box p={3} className={classes.content}>
                <Route exact path={"/"}>Home</Route>
                <Route exact path={`${path}sessions`} component={Sessions}/>
                <Route exact path={`${path}friends`} component={Friends}/>
                <Route exact path={`${path}account`} component={Account}/>
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
                <HomeSidebar/>
            </Drawer>
        </div>
    );
}
