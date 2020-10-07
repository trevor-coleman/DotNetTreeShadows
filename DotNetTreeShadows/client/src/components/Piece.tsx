import React, {FunctionComponent} from 'react';
import {makeStyles} from "@material-ui/core/styles";

export interface IPieceProps {
    size: number;
    price: string;
    status: PieceStatus;
    color: string;
}

type PieceProps = IPieceProps;

const statusStyles: {
    [status: string]: {
        [key: string]: string | undefined
    }
} = {
    Ready: {
        border: '1px solid yellow',
        color: 'white',
        hoverBackgroundColor: 'yellow',
    },
    Filled: {
        border: '1px solid darkGreen',
        color: 'white',
    },
    Empty: {
        backgroundColor: 'white',
        border: '1px dashed lightGrey',
        color: 'lightGrey',
    },

};


const sizeFromProps = ({size}: IPieceProps) => size;
const styleFromStatus = (attribute: string, fallback: string | null = null) => {
    if (fallback) return ({status}: IPieceProps) => statusStyles[status][attribute] ?? statusStyles[status][fallback]
    return ({status}: IPieceProps) => statusStyles[status][attribute];
}

const backgroundColorFromProps = ({status, color}:IPieceProps) => status == "Empty"
    ? "white" : color;

const useStyles = makeStyles({
    Piece: {
        borderRadius: '100%',
        width: sizeFromProps,
        height: sizeFromProps,
        border: styleFromStatus('border', null),
        backgroundColor: backgroundColorFromProps,
        "&:hover": {
            backgroundColor: styleFromStatus('hoverBackgroundColor', 'backgroundColor')
        },
        color: styleFromStatus('color'),
        textAlign: 'center',
        lineHeight: ({size}: IPieceProps) => `${size}px`,
        fontSize: ({size}: IPieceProps) => `${(
            size / 50) * 2}em`,
    },
});

export type PieceStatus =
    "Ready"
    | "Filled"
    | "Empty";
const Piece: FunctionComponent<IPieceProps> = (props: PieceProps) => {
    const classes = useStyles(props);
    const {price} = props;


    return (
        <div className={classes.Piece}>{price}</div>);

};

export default Piece;
