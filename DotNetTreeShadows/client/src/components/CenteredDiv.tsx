import React, {FunctionComponent, PropsWithChildren} from 'react';
import {useDispatch} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';


interface ICenteredDivProps {
    width?: number | string,
    height?: number | string,
    border?: boolean
}

type CenteredDivProps = PropsWithChildren<ICenteredDivProps>;

//COMPONENT
const CenteredDiv: FunctionComponent<CenteredDivProps> = (props: CenteredDivProps) => {
    const {children} = props;
    const classes = useStyles(props);
    const dispatch = useDispatch();

    return (
        <div className={classes.outer}>
            <div className={classes.inner}>
                {children}
            </div>
        </div>);
};

const useStyles = makeStyles({
    outer: {
        position: "relative",
        width:({width}: CenteredDivProps) => width ?? "100%",
        height:({height}: CenteredDivProps) => height ?? "100%",
        border:({border}: CenteredDivProps)=> border ? "1px dotted magenta" : undefined
    },
    inner: {position: "absolute",
        top: "50%",
        left: "50%",
        border: "2px dashed fuschia",
        transform: "translate(-50%,-50%)",},
});

export default CenteredDiv;
