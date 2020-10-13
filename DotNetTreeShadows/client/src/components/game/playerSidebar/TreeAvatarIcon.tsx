import React, {FunctionComponent} from 'react';
import {useDispatch} from 'react-redux';
import {makeStyles, Theme} from '@material-ui/core/styles';
import {Avatar} from "@material-ui/core";
import SvgIcon from "@material-ui/core/SvgIcon";
import {TreeType} from "../../../store/board/types/treeType";
import {PieceType} from "../../../store/board/types/pieceType";
import TreeSVG from "../../../svg/TreeSVG";
import treeColor from "../treeColor";
import Color from "color";

interface TreeAvatarIconProps {
    treeType: TreeType,
    pieceType?: PieceType,
    text?: string,
    active?: boolean,
    gridHeader?: boolean,
    empty?: boolean,
    connected?: boolean,
    size?: number,
    fontSize?: "inherit" | "default" | "large" | "small" | undefined,

}

interface styleProps extends TreeAvatarIconProps {
    color: string,
}

//COMPONENT
const TreeAvatarIcon: FunctionComponent<TreeAvatarIconProps> = (props: TreeAvatarIconProps) => {
    const {treeType, text, gridHeader, empty, size:propSize} = props;
    const pieceType = props.pieceType ?? PieceType.MediumTree;
    const active = props.active ?? true;

    let connected = props.connected ?? false;


    let size = propSize ?? 24;
    let center = size / 2;
    let scale: number;

    switch (pieceType) {
        case PieceType.Seed:
            scale = 1.5;
            break;
        case PieceType.SmallTree:
            scale = 1.3;
            break;
        case PieceType.MediumTree:
            scale = 1.1;
            break;
        case PieceType.LargeTree:
            scale = 1;
            break;

    }
    const color = treeColor(treeType, active ? 1 : 0.2);

    let styleProps={
        ...props,
        connected,
        color
    };

    const classes = useStyles(styleProps);

    useDispatch();

    const svgTree = TreeSVG(treeType, pieceType)





    return (
        <Avatar style={{border: gridHeader ? `2px outset ${color}` : empty ? "1px dashed grey" : connected == true ? "3px solid green" : undefined}} className={classes.avatar}>
            {text || empty
                ? text
                : <SvgIcon fontSize={props.fontSize ?? "inherit"}>
                    <svg className={classes.svg} xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${size} ${size}`}>
                        {gridHeader ? "" :
                            <circle cx={center} cy={center} r={size / 2} fill={Color(color).lighten(2.5).toString()}/>}
                        {connected?
                            <image href={svgTree} x={center - (size * scale * 0.5)} y={center - (size * scale * 0.5)}
                               width={size * scale} height={size * scale}/>:<image href={svgTree} x={center - (size * scale * 0.5)} y={center - (size * scale * 0.5)}
                                                                                   width={size * scale} height={size * scale}/>}
                    </svg>
                </SvgIcon>}
        </Avatar>);
};

const useStyles = makeStyles((theme: Theme) => ({
    svg: {
        pointerEvents:"none"
    },

    avatar: {
        backgroundColor: ({color, empty, gridHeader}: styleProps) => empty || gridHeader ? "#fff" : color,
        color: ({color, empty}: styleProps) => empty ? "grey" : theme.palette.getContrastText(color),
        width: ({size}:styleProps) => size,
        height: ({size}:styleProps) => size,
    },
}));

export default TreeAvatarIcon;

