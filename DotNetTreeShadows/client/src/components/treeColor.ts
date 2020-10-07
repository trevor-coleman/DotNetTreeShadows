import {TreeType} from "../store/board/treeType";

export default function treeColor (treeType: TreeType):string  {
    switch (treeType as TreeType) {
        case TreeType.Aspen:
            return "#703510";
        case TreeType.Ash:
            return "#275371"
        case TreeType.Birch:
            return "#6d4c0a";
        case TreeType.Poplar:
            return "#19572b";
    }
    throw new Error("Unknown TreeType");
}
