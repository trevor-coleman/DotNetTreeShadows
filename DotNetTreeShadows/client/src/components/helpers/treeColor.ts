import {TreeType} from "../../store/board/types/treeType";
import Color from "color";

export default function treeColor (treeType: TreeType, opacity:number = 1):string  {
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
    }

    return Color(color).alpha(opacity).toString();


}
