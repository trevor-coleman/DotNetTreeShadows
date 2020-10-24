import React from 'react';
import {makeStyles, useTheme, Theme, createStyles} from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import {IconButton} from "@material-ui/core";
import MenuIcon from '@material-ui/icons/Menu';
import {Route, useRouteMatch} from "react-router-dom";
import HomeSidebar from "../HomeSidebar";
import Sessions from "../Sessions";
import Friends from "../Friends";
import Account from "../Account";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import { signOut } from '../../store/auth/reducer';
import {useDispatch} from "react-redux";
import {useTypedSelector} from "../../store";
import { signOutAndClearStore } from '../../store/auth/thunks';


const drawerWidth = 280;

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {

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
        title: {
            flexGrow: 1,
        },
        content: {
            paddingLeft: drawerWidth + theme.spacing(3),
            paddingTop: theme.spacing(3),
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

        menuIcon: {
            color: "white"
        },
        toolbarSpacer: {
            ...theme.mixins.toolbar
        }
    }),
);



interface IHomeScreenProps {}

export default function HomeScreen(props: IHomeScreenProps) {
    const classes = useStyles();
    let { path, url } = useRouteMatch();
    const theme = useTheme();
    const dispatch=useDispatch();
    const {name: userName} = useTypedSelector(state => state.profile)
    const [open, setOpen] = React.useState(true);
    const toggleDrawerOpen = () => {
        setOpen(!open);
    };

    const handleSignOut = () => {
        dispatch(signOutAndClearStore())
    }


    return (
        <div className={classes.root}>
            <AppBar
                position="fixed"
                className={classes.appBar}
            >
                <Toolbar>
                    <IconButton onClick={toggleDrawerOpen}><MenuIcon className={classes.menuIcon}/></IconButton>
                    <Typography variant="h6" noWrap className={classes.title}>
                        TreeShadows - {userName}
                    </Typography>
                    <Button color="inherit" onClick={handleSignOut}>Sign Out</Button>
                </Toolbar>
            </AppBar>
            <div className={classes.toolbarSpacer}/>
            <Container className={classes.content}>
                <Route exact path={"/"}>Home</Route>
                <Route exact path={`${path}sessions`} component={Sessions}/>
                <Route exact path={`${path}friends`} component={Friends}/>
                <Route exact path={`${path}account`} component={Account}/>
            </Container>
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
