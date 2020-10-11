import React from 'react';
import Tile from '../../store/board/types/tile'
import TreeSVG from '../../svg/TreeSVG';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Sun from '../../svg/sun-svgrepo-com.svg';
import {RootState} from "../../store/store";
import {Hex} from "../../store/board/types/Hex";
import {useSelector} from "react-redux";
import {TreeType} from "../../store/board/types/treeType";
import {PieceType} from "../../store/board/types/pieceType";
import {HexLayout} from "../../store/board/types/HexLayout";
import {SunPosition} from "../../store/game/types/sunPosition";
import treeColor from "./treeColor";
import Color from "color";

interface IBoardTileProps {
    onClick?: (hexCode: number) => void,
    onMouseEnter?: (hexCode: number) => void,
    onMouseLeave?: (hexCode: number) => void,
    hexCode?: number,
    layout?: HexLayout,
    pieceType?: PieceType,
    treeType?: TreeType
    outline?: boolean
    sizeFactor?: number
}

const BoardTile = (props: IBoardTileProps) => {

    const {outline, onClick, onMouseEnter, onMouseLeave, layout, hexCode, pieceType: propPiece, treeType: propTree} = props;
    const sizeFactor = props.sizeFactor ?? 1.2;

    const safeHexCode = (hexCode ? hexCode : 0) as number;
    const tileCode = useSelector((state:RootState)=>state.board.tiles[safeHexCode]);
    const sunPosition = useSelector((state:RootState)=>state.game.sunPosition) as SunPosition
    const center = layout ? layout.hexToPixel(new Hex(safeHexCode)) : {x:60,y:60};

    const hex = new Hex(safeHexCode);
    const pieceType: null | PieceType = propPiece == null ? Tile.GetPieceType(tileCode) as PieceType : propPiece;
    const treeType: null | TreeType = propTree == null ? Tile.GetTreeType(tileCode) as TreeType : propTree;
    const shadowHeight: number = Tile.GetShadowHeight(tileCode);
    const shaded = shadowHeight > 0;



    const sky = Math.abs(hex.q) == 4 || Math.abs(hex.r) == 4 || Math.abs(hex.s) == 4;
    let sun:boolean = false;
    switch (sunPosition) {
        case SunPosition.NorthWest:
            sun = (hex.r == -4 || hex.s == 4)
            break;
        case SunPosition.NorthEast:
            sun = hex. q == 4 || hex.r == -4
            break;
        case SunPosition.East:
            sun = hex. q == 4 || hex.s == -4
            break;
        case SunPosition.SouthEast:
            sun = hex.r == 4 || hex.s == -4
            break;
        case SunPosition.SouthWest:
            sun = hex. q == -4 || hex.r == 4
            break;
        case SunPosition.West:
            sun = hex.q == -4 || hex.s == 4
            break;


    }

    const classes = useStyles(props);

    const handleClick = () => {
        if (onClick && !sky) onClick(safeHexCode);
    }

    let backgroundColor: string;
    let strokeColor: string = "#010"
    if (sky) {
        backgroundColor = "#72CEE0";
    } else if (pieceType != null && treeType!= null) {
        if (outline) {
            backgroundColor= "#fff"
            strokeColor = treeColor(treeType);}
        else
            {
                backgroundColor = treeColor(treeType)
            }
    } else {
        backgroundColor = "#acbeac";
    }

    const treeIcon: string | null = sky
        ? null
        : treeType!=null && pieceType!=null
            ? TreeSVG(treeType, pieceType)
            : null;



    const sunIcon: string | null = sky && sun
        ? Sun
        : null;

    function handleMouseEnter(): void {
        if (onMouseEnter) onMouseEnter(safeHexCode);
    }

    function handleMouseLeave(): void {
        if (onMouseLeave) onMouseLeave(safeHexCode);
    }

    const size = layout?.size.x || 60;

    return (<g>
        <circle onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={handleClick} cx={center.x}
                cy={center.y} r={size/sizeFactor} fill={backgroundColor} strokeWidth={2} stroke={strokeColor}/>
        {treeIcon ? <circle cx={center.x} cy={center.y} r={size/1.8} fill={Color(backgroundColor).lighten(2).toString()} strokeWidth={"0.2"} stroke={"#000"}/>:""}
        {sunIcon
            ? <image href={sunIcon} x={center.x - size / 2} y={center.y - size / 2} width={size} height={size}/>
            : ''}
        {treeIcon
            ? <image href={treeIcon} x={center.x - size / 2} y={center.y - size / 2} width={size} height={size}/>
            : ''}
        {shaded
            ? <circle cx={center.x} cy={center.y} r={size/1.2} fill={"rgba(0,0,0,0.3)"} strokeWidth={"0.2"} stroke={"#000"}/>
            : ''}
    </g>)
};

const useStyles = makeStyles({
    root: {
        width: (props: IBoardTileProps) =>  props.layout?.size.x || 140,
        height: (props: IBoardTileProps) => props.layout?.size.y || 140,
    },
});


export default BoardTile;
