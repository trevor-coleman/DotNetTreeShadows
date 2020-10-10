import React, {FunctionComponent} from 'react';
import {useDispatch} from 'react-redux';
import {makeStyles, Theme} from '@material-ui/core/styles';
import {Avatar} from "@material-ui/core";
import SvgIcon from "@material-ui/core/SvgIcon";
import {TreeType} from "../store/board/types/treeType";
import {PieceType} from "../store/board/types/pieceType";
import TreeSVG from "../svg/TreeSVG";
import treeColor from "./game/treeColor";
import Color from "color";

interface TreeAvatarIconProps {
    treeType: TreeType,
    pieceType?: PieceType,
    text?: string,
    active?: boolean,
}

interface styleProps {
    color:string,
    active?: boolean,
}

//COMPONENT
const TreeAvatarIcon: FunctionComponent<TreeAvatarIconProps> = (props: TreeAvatarIconProps) => {
    const {treeType, text} = props;
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

    const color = treeColor(treeType, active?1:0.2);

    const classes = useStyles({
        color
    });

    return (
        <Avatar className={classes.avatar}>
            {text
                ? text
                : <SvgIcon>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${size} ${size}`}>
                        <image href={svgTree} x={center - (size * scale * 0.5)} y={center - (size * scale * 0.5)}
                               width={size * scale} height={size * scale}/>
                    </svg>
                </SvgIcon>}
        </Avatar>);
};

const useStyles = makeStyles((theme: Theme) => ({
    avatar: {
        backgroundColor: ({color}: styleProps) => color,
        color: ({color}: styleProps) => theme.palette.getContrastText(color),
    }
}));

export default TreeAvatarIcon;

