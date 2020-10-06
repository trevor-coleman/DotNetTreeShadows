import React from 'react';
import Tile from '../store/board/tile'
import TreeSVG from '../svg/TreeSVG';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Sun from '../svg/sun-svgrepo-com.svg';
import {Point} from '../store/board/hex-grid/Point';
import {RootState} from "../store";
import {Hex} from "../store/board/hex-grid/Hex";
import {connect, ConnectedProps} from "react-redux";
import {TreeType} from "../store/board/treeType";
import {PieceType} from "../store/board/pieceType";

const mapStateToProps = (state: RootState) => {
    return {tiles: state.board.displayTiles};
};

const connector = connect(mapStateToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;


interface IBoardTileProps {
    onClick?: (hexCode: number) => void,
    onMouseEnter?: (hexCode: number) => void,
    onMouseLeave?: (hexCode: number) => void,
    size: number
    hexCode: number
    center: Point,
}

type BoardTileProps = IBoardTileProps & PropsFromRedux;

const BoardTile = (props: BoardTileProps) => {

    const {hexCode, tiles, onClick, onMouseEnter, onMouseLeave, size, center} = props;

    const tileCode = tiles[hexCode];
    const hex = new Hex(hexCode);
    const pieceType: null | PieceType = Tile.GetPieceType(tileCode);
    const treeType: null | TreeType = Tile.GetTreeType(tileCode);
    const shadowHeight: number = Tile.GetShadowHeight(tileCode);
    const shaded = shadowHeight > 0;

    const sky = Math.abs(hex.q) == 4 || Math.abs(hex.r) == 4 || Math.abs(hex.s) == 4;
    const sun = false;

    const classes = useStyles(props);

    const treeColor = (treeType: TreeType):string => {
        switch (treeType) {
            case TreeType.Aspen:
                return "#703510";
            case TreeType.Ash:
                return "#1c415a"
            case TreeType.Birch:
                return "#6d4c0a";
            case TreeType.Poplar:
                return "#19572b";
        }
        throw new Error("Unknown TreeType");
    }

    const handleClick = () => {
        if (onClick) onClick(hexCode);
    }

    let backgroundColor: string;
    if (sky) {
        backgroundColor = "#72CEE0";
    } else if (pieceType && treeType) {
        backgroundColor = treeColor(treeType)
    } else {
        backgroundColor = "#acbeac";
    }

    const treeIcon: string | null = sky
        ? null
        : treeType && pieceType
            ? TreeSVG(treeType, pieceType)
            : null;


    const sunIcon: string | null = sky && sun
        ? Sun
        : null;

    function handleMouseEnter(): void {
        if (onMouseEnter) onMouseEnter(hexCode);
    }

    function handleMouseLeave(): void {
        if (onMouseLeave) onMouseLeave(hexCode);
    }

    return (<g>
        <circle onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={handleClick} cx={center.x}
                cy={center.y} r={size / 1.2} fill={backgroundColor} strokeWidth={2} stroke={"#010"}/>
        {sunIcon
            ? <image href={sunIcon} x={center.x - size / 2} y={center.y - size / 2} width={size} height={size}/>
            : ''}
        {treeIcon
            ? <image href={treeIcon} x={center.x - size / 2} y={center.y - size / 2} width={size} height={size}/>
            : ''}
        {shaded
            ? <circle cx={500} cy={500} r={450} fill={"rgba(0,0,0,0.3)"} strokeWidth={"0.2"} stroke={"#000"}/>
            : ''}
    </g>)
};

const useStyles = makeStyles({
    root: {
        width: (props: BoardTileProps) => props.size,
        height: (props: BoardTileProps) => props.size,
    },
});


export default connector(BoardTile);
