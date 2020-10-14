import React, {FunctionComponent, PropsWithChildren} from 'react';
import {useDispatch} from 'react-redux';
import {makeStyles, Theme} from '@material-ui/core/styles';
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";


interface ISidebarGridProps {
    spacing?: 0 | 2 | 10 | 1 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | undefined;
    m?: 0 | 2 | 10 | 1 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | undefined;
    p?: 0 | 2 | 10 | 1 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | undefined;
}

type SidebarGridProps = PropsWithChildren<ISidebarGridProps>

//COMPONENT
const SidebarGrid: FunctionComponent<SidebarGridProps> = (props: SidebarGridProps) => {
    const {children} = props;
    const spacing = props.spacing ?? 1;
    const m = props.m ?? 1;
    const p = props.p ?? 1;

    return (
        <Box p={p}>
        <Grid container direction={"column"} spacing={spacing}>
            {children ? React.Children.map(props.children, child=><Grid item>{child}</Grid>):""}
        </Grid>
        </Box>
        );
};

export default SidebarGrid;
