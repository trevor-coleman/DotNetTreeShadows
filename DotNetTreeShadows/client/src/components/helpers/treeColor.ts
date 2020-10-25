import {TreeType} from "../../store/board/types/treeType";
import Color from "color";
import interpolate from "color-interpolate";

export default function treeColor (treeType: TreeType|null, opacity:number = 1):string  {
    let color:string = "#fff";
    switch (treeType as TreeType) {
        case TreeType.Aspen:
            color="#703510";
            break;
        case TreeType.Ash:
            color= "#275371"
            break;
        case TreeType.Birch:
            color= "#6d4c0a";
            break;
        case TreeType.Poplar:
            color= "#21773b";
            break;
      default:
        color="#c9c9c9"
    }

    return Color(color).alpha(opacity).toString();
}

const tileColorMap = interpolate(['#3a5c2b', "#89ba7e"])
export function tileColor (distance:number) {
  return tileColorMap(distance / 3);
}
