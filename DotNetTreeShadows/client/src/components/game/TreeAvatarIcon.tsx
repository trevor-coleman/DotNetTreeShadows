import React, {FunctionComponent} from 'react';
import {useDispatch} from 'react-redux';
import {makeStyles, Theme} from '@material-ui/core/styles';
import {Avatar} from "@material-ui/core";
import SvgIcon from "@material-ui/core/SvgIcon";
import {TreeType} from "../../store/board/types/treeType";
import {PieceType} from "../../store/board/types/pieceType";
import TreeSVG from "../../svg/TreeSVG";
import treeColor from "./treeColor";
import Color from "color";

interface TreeAvatarIconProps {
    treeType: TreeType,
    pieceType?: PieceType,
    text?: string,
    active?: boolean,
    gridHeader?: boolean
    empty?: boolean
}

interface styleProps extends TreeAvatarIconProps {
    color: string,
}

//COMPONENT
const TreeAvatarIcon: FunctionComponent<TreeAvatarIconProps> = (props: TreeAvatarIconProps) => {
    const {treeType, text, gridHeader, empty} = props;
    const pieceType = props.pieceType ?? PieceType.MediumTree;
    const active = props.active ?? true;

    let size = 24;
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


    useDispatch();

    const svgTree = TreeSVG(treeType, pieceType)

    const color = treeColor(treeType, active ? 1 : 0.2);

    const classes = useStyles({
        ...props,
        color
    });

    return (
        <Avatar className={classes.avatar}>
            {text || empty
                ? text
                : <SvgIcon>
                    <svg className={classes.svg} xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${size} ${size}`}>
                        {gridHeader ? "" :
                            <circle cx={center} cy={center} r={size / 2} fill={Color(color).lighten(2.5).toString()}/>}
                        <image href={svgTree} x={center - (size * scale * 0.5)} y={center - (size * scale * 0.5)}
                               width={size * scale} height={size * scale}/>

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
        color: ({color, empty}: styleProps) => empty ? "#ccc" : theme.palette.getContrastText(color),
        border: ({color, empty, gridHeader}) => gridHeader ? `2px outset ${color}` : empty ? "1px dashed lightgrey" : undefined,

    },
}));

export default TreeAvatarIcon;

