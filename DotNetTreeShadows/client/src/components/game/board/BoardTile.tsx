import React from 'react';
import Tile from '../../../store/board/types/tile'
import TreeSVG from '../../../svg/TreeSVG';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Sun from '../../../svg/sun-svgrepo-com.svg';
import {RootState} from "../../../store/store";
import {Hex} from "../../../store/board/types/Hex";
import {useSelector} from "react-redux";
import {TreeType} from "../../../store/board/types/treeType";
import {PieceType} from "../../../store/board/types/pieceType";
import {HexLayout} from "../../../store/board/types/HexLayout";
import {SunPosition} from "../../../store/game/types/sunPosition";
import treeColor from "../../helpers/treeColor";
import Color from "color";
import {useTypedSelector} from "../../../store";
import GameScreen from "../GameScreen";
import {GameStatus} from "../../../store/game/types/GameStatus";
import {cursorTo} from "readline";
import {GameOption} from "../../../store/game/types/GameOption";
import {GameActionType} from "../../../store/game/actions";
import PlayerBoard from "../../../store/game/types/playerBoard";
import {handleTileClick} from "../../../store/game/gameActions";

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
    const tileCode = useTypedSelector(state=>state.board.tiles[safeHexCode]);
    const sunPosition:SunPosition = useTypedSelector(state=>state.game.sunPosition);
    const {status, turnOrder, currentTurn, gameOptions, currentActionType, tilesActiveThisTurn, playerBoards} = useTypedSelector(state => state.game);
    const origin = useTypedSelector(state => state.game.currentActionOrigin)
    const originCode = useTypedSelector(state=> origin ? state.board.tiles[origin] : 0);
    const {id:playerId} = useTypedSelector(state => state.profile)
    const playerBoard = playerBoards[playerId];

    const center = layout ? layout.hexToPixel(new Hex(safeHexCode)) : {x:60,y:60};

    const hex = new Hex(safeHexCode);
    const pieceType: null | PieceType = propPiece == null ? Tile.GetPieceType(tileCode) as PieceType : propPiece;
    const treeType: null | TreeType = propTree == null ? Tile.GetTreeType(tileCode) as TreeType : propTree;
    const shadowHeight: number = Tile.GetShadowHeight(tileCode);

    const sky = Math.abs(hex.q) == 4 || Math.abs(hex.r) == 4 || Math.abs(hex.s) == 4;
    const shaded = !sky && shadowHeight > 0;


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

    const isEligible = ():boolean => {
        if(turnOrder[currentTurn] !== playerId) return false;
        if(Hex.IsSky(safeHexCode)) return false;

        if (status === GameStatus.PlacingFirstTrees || status === GameStatus.PlacingSecondTrees) {
            return (Hex.IsOnEdge(safeHexCode)
              && Tile.IsEmpty(tileCode))
              && !(gameOptions[GameOption.PreventActionsInShadow]
                && Tile.IsShadowed(tileCode) )
        }
        const pieceHeight = Tile.GetPieceHeight(tileCode);
        if(currentActionType == GameActionType.Grow) {

            return Tile.TreeTypeIs(tileCode, PlayerBoard.TreeType(playerBoard) )
              && pieceHeight < 3
              && pieceHeight + 1 <= PlayerBoard.GetLight(playerBoard)
              && PlayerBoard.getPieces(playerBoard, pieceHeight + 1).available >0;
        }

        if(currentActionType == GameActionType.Plant) {
            console.log(tilesActiveThisTurn)
            if(origin == null) {
                return pieceHeight > 0
                  && pieceHeight < 4
                  && PlayerBoard.TreeType(playerBoards[playerId]) == treeType
                  && tilesActiveThisTurn.indexOf(safeHexCode) == -1;
            } else {
                const distance = Hex.Distance( new Hex(origin), hex);
                const originHeight = Tile.GetPieceHeight(originCode);
                return distance <= originHeight && distance > 0 && Tile.IsEmpty(tileCode);
            }
        }
        return false;

    }

    const isSelected = (): boolean => {
        if(status == GameStatus.InProgress) {
            if (hexCode && safeHexCode == origin) return true;
        }
        return false;
    }

    const selected = isSelected();
    const eligible = isEligible();

    const classes = useStyles(props);

    const handleClick = () => {
        if (onClick && eligible && !sky) onClick(safeHexCode);
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
    const sunSize = size*2/1.18;
    const borderPercent = 0.33;

    return (<g>
        <circle cx={center.x}
                cy={center.y} r={size/sizeFactor} fill={backgroundColor} strokeWidth={2} stroke={strokeColor}/>
        {treeIcon ? <circle cx={center.x} cy={center.y} r={size*(1-borderPercent)} fill={Color(backgroundColor).lighten(1.8).toString()} strokeWidth={"0.2"} stroke={"#000"}/>:""}
        {sunIcon
            ? <image href={sunIcon} x={center.x - sunSize / 2} y={center.y - sunSize / 2} width={sunSize} height={sunSize}/>
            : ''}
        {treeIcon
            ? <image href={treeIcon} x={center.x - size / 2} y={center.y - size / 2} width={size} height={size}/>
            : ''}
        {shaded
            ? <circle cx={center.x} cy={center.y} r={size/1.2} fill={"rgba(0,0,0,0.3)"} strokeWidth={"0.2"} stroke={"#000"}/>
            : ''}
        {selected
          ? <circle cx={center.x} cy={center.y} r={size/1.2} fill={"rgba(0,0,255,0.2)"} strokeWidth={"10"} stroke={"#00F"}/>
          : ''}
        {eligible
          ? <circle cx={center.x} cy={center.y} r={size/1.2} fill={"rgba(0,255,0,0.5)"} strokeWidth={"10"} stroke={"#0C0"}/>
          : ''}
        <circle onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={handleClick} cx={center.x}
                cy={center.y} r={size/sizeFactor} fill={"rgba(255,255,255,0)"} strokeWidth={2} stroke={strokeColor}/>
    </g>)
};

const useStyles = makeStyles({
    root: {
        width: (props: IBoardTileProps) =>  props.layout?.size.x || 140,
        height: (props: IBoardTileProps) => props.layout?.size.y || 140,
    },
});


export default BoardTile;
