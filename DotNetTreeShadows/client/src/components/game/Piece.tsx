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
        backgroundColor: 'white',
    },
    Filled: {
        border: '1px solid black',
        color: 'grey',
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

const backgroundColorFromProps = ({status, color}:IPieceProps) => status != "Filled"
    ? "white" : color;

const colorFromProps = ({status, color}:IPieceProps) => {
    switch (status) {
        case "Ready":
            return color;
        case "Filled":
            return "white"
        case "Empty":
            return "lightgrey"
    }
}

const borderFromProps = ({status, color}:IPieceProps) => {
    switch (status) {
        case "Ready":
            return `1px solid ${color}`
        case "Filled":
            return `1px solid ${color}`
        case "Empty":
            return '1px dashed lightGrey';
    }
}



const useStyles = makeStyles({
    Piece: {
        borderRadius: '100%',
        width: sizeFromProps,
        height: sizeFromProps,
        border: borderFromProps,
        backgroundColor: backgroundColorFromProps,
        color: colorFromProps,
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
